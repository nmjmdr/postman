let calls = 0;

module.exports = (name, failAfter) => {
  return {
    fn: (mail)=>{
      console.log("------------------------------------------------");
      calls++
      if(calls === failAfter) {
        calls = 0;
        console.log("%s: failed to send mail - %s",name, mail.id);
        return Promise.reject("%s: failed to send mail",name);
      }
      console.log("%s: sent mail - %s",name, mail.id);
      return Promise.resolve(true);
    },
    isUnavailableError: (err) => {
      return true;
    }
  }
}
