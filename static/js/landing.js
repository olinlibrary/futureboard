$(function(){
  if(!Cookies.get("wifiWarnings")){
    Cookies.set('wifiWarnings',
                'true',
                { expires: 7 }); // cookie  expires in 7 days
    $('.modal').modal();
    $('#modal1').modal('open');
  }
});
