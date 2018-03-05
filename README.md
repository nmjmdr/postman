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

Topics to explore further:
1. Multi queues
2. Extending circuit breaker to monitor the health of worker
3. Distributed config management - such as Zookeeper
4. Potential use of proxy to determine if a mail has already been sent
