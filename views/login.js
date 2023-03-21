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

let loginForm=document.querySelector('.form');
let forgot=document.getElementById('forgot');
forgot.addEventListener('click',(e)=>{
    e.preventDefault();
    loginForm.innerHTML=`<label class="email">Email:</label>
    <input type="email" id="email" name="email"><br><br>
    <label class="phone">Phone:</label>
    <input type="phone" id="phone" name="phone"><br><br>
    <button id="Send">Send</button>`

    let send=document.getElementById('Send');
    send.addEventListener('click',async(e)=>{
        e.preventDefault();
        let email=document.getElementById('email').value;
        let phone=document.getElementById('phone').value;
        let forgotP={email,phone}
    try{
          await axios.post('http://localhost:3000/forgotpass',forgotP).then(res=>{
            if(res.data.success==true)
            {
                let forg={user:res.data.userToken,forgot:res.data.forgot};
                popup(res.data.message);
                localStorage.setItem('forgot',JSON.stringify(forg));
                success();

            }   
          })
       }
       catch(err)
       {
        console.log(err);
        popup(err.response.data.message)
       }
    })
})

function success()
{
   loginForm.innerHTML=`<label class="password">Password:</label>
   <input type="password" id="password" name="password"><br><br>
   <button id="reset">Reset</button><br><br>`;

   let reset=document.getElementById('reset');
   reset.addEventListener('click',async(e)=>{
     e.preventDefault();
     let fp=JSON.parse(localStorage.getItem('forgot'));
     let userToken=fp.user;
     let fToken=fp.forgot;
     let password=document.getElementById('password').value;
     if(password=='')
     {
        popup('password cannot null');
        return;
     }
     let pack={userToken,fToken,password};
    try{
        await axios.post('http://localhost:3000/forgotpasssuccess',pack)
        .then(res=>{
            if(res.data.success==true)
            {
                localStorage.removeItem('forgot');
                popup('password changed successfully');
                window.location.href='./login.html';
            }
            else{
                localStorage.removeItem('forgot');
                popup('something went wrong please retry');
            }
        })
    }
    catch(err)
    {
        console.log(err);
    }
   })
}