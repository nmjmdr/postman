# postman
Sends emails reliably (supports failover) using services such as Sendgrid and Mailgun  

### Design goals:

1. Reliablity
The service should be able to failover from one provider (say Sendgrid) to another provider (say Mailgun) if the either of the services are not available to deliver emails. 

2. Minimal data loss
In case there are issues with the providers it should not (ideally) lead to loss of any mails that are to be delivered

3. Configurable
It should be possible to plug in new providers or retire existing ones without impacting the availiblity of the system.

4. Scailiblity
It should be possible to horizontally scale the service by adding more instances.

5. Flexibity in deployment
It should be possible encapsuatle the core functionalities in such way that it if we required we can deploy the service on AWS, Google Cloud, in data centers.
A side effect of this goal, is that it should be possible to easily run and debug the application locally.

### Design
![Design](https://raw.githubusercontent.com/nmjmdr/postman/master/screenshots/Design.png)

#### Core Idea
```
1. The code idea is to have a set of workers fetch mails that need to delivered and pass them the providers. 
2. In case the worker faces an issue sending the mail one provider (let us call it the primary), it needs to use an alternative (let us call it the secondary).
      2.a. If an error has occured recently in using a provider (say provider A), there is a very good probablity that it might continue to fail for the next few calls.
      2.b Thus it is essential for the worker to continue to use the provider that works currently. 
      2.c. It could try and see if the error (for provider A) is now resolved
      2.d If yes, it can move to using provider A
3. The workers can randomly select a provider as primary and other provider as secondary. This way there would be a good distribution of providers being used across workers.
```
#### Circuit Breaker
_Point 2 calls for the use of circuit breaker_. The solution includes a circuit breaker that can accomplish Point 2. It also includes a customizable functionality (injected as functions) to determine:
1. When the probe (an attempt to see if the error is now resolved) should be carried out
2. Determine if an encountered error is due to provider or something else (most commonly input errors)

The circuit breaker developed in this solution can be used as a library across other projects. It has been unit tested with an attempt to cover all the scenarios.

#### Queue
##### Queue should support `read` and `visiblity timeout`
One of the problems with above approach is this:
1. Assume a worker fetches an item from the queue. The item is deleted (dequeued).
2. The worker is unable to send the message

This results in the data loss which we are aiming to avoid. To overcome this the queue should support:
1. Ability to read from the queue without deleting the item, but at the same time the item not being availble for other workers.
2. We can treat `item read by a worker and not being available for other workers` as an item being "assigned" to a worker
3. We need an ability for this "assignment" to expire. (aka visiblity timeout)

##### Candidates for implementation of such a queue


#### Workers:
Workers can be deployed as standalone processes or as serverless functions (Ex: AWS lambda).

### Topics to explore further:
1. Multi queues to scale the queue (http://arxiv.org/pdf/1411.1209.pdf)
2. Extending circuit breaker to monitor the health of worker
3. Distributed config management - such as Zookeeper
4. Potential use of proxy to determine if a mail has already been sent
