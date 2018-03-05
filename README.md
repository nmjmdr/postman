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
1. The code idea is to have a set of workers fetch mails that need to delivered and pass them the providers. 
2. In case the worker faces an issue sending the mail one provider, it needs to use an alternative.
      2.a. If an error has occured recently in using a provider, there is a very good probablity that it might continue to fail for the next few calls.
      2.b Thus it is essential for the worker to continue to use the provider that works currently. 
      2.c. It could try and attempt 


### Topics to explore further:
1. Multi queues to scale the queue (http://arxiv.org/pdf/1411.1209.pdf)
2. Extending circuit breaker to monitor the health of worker
3. Distributed config management - such as Zookeeper
4. Potential use of proxy to determine if a mail has already been sent
