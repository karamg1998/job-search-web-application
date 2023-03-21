let signup=document.getElementById('signup');

signup.addEventListener('click',async (e)=>{
    e.preventDefault();
    let name=document.getElementById('name').value;
    let email=document.getElementById('email').value;
    let phone=document.getElementById('phone').value;
    let pass=document.getElementById('password').value;

    let user={name,email,phone,pass};
   try{
    if(name=='')
   {
      let n='*name cannot empty';
      popup(n);
      return;
   }
   if(email=='')
   {
    let e='*email cannot empty';
    popup(e);
    return;
   }
   if(phone=='')
   {
    popup('phone cannot be null');
    return;
   }
   if(pass=='')
   {
    let p='*password cannot empty';
    popup(p);
    return;
   }
  
    await axios.post('http://localhost:3000/adduser',user)
    .then(res=>{
       popup(res.data.message);
       if(res.data.success==true)
       {
         window.location.href = "./login.html"
       }
    })
   }
   catch(err){
      console.log(err);
   }
})

function popup(data)
{
  let element=document.querySelector('.popup');
      let n_element=document.createElement('div');
      n_element.className='toast';
      n_element.innerText=data;
      element.appendChild(n_element);
      setTimeout(()=> {
        n_element.remove();
        },2000); 
}

