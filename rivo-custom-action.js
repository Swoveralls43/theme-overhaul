const customActionName = "Sign up for Texts";
  const proxyUrl = `${window.Rivo.global_config.proxy_paths.loy}/loy/customers/${window.Rivo.common.customer.id}/record_custom_action`;
  const data = {custom_action_name: customActionName};
  
  window.addEventListener("load", (event) => {
    fetch(proxyUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(res){
      console.log(res)
      success(res);
    })
    .catch(function(res){ console.log(res) })
  })