let login=document.getElementById('login');
login.addEventListener('click',(e)=>{
    e.preventDefault();
    let email=document.getElementById('email').value;
    let pass=document.getElementById('password').value;
    if(email==='')
    {
        let e='*email cannot empty';
        popup(e);
        return;
    }
    if( pass==='')
    {
        let p='*password cannot empty';
        popup(p);
        return;
    }

    axios.get('http://localhost:3000/getuser',{headers:{'email':email,'pass':pass}})
    .then(user=>{
       console.log(user.data);
       if(user.data.success===true)
       {
        let User={name:user.data.name,
                  token:user.data.token
                }
        localStorage.setItem('token',JSON.stringify(User));
        window.location.href = "./gethired.html"
       }  
    }).catch((err)=>{
        console.log(err);
        popup(err.response.data.message);
    })
});

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

