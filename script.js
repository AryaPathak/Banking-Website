'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Arya Pathak',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Nazir Khaimee',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Niraj Karande',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Aniket Kashid',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
//const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(acc, sort=false){

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;

  movs.forEach(function(mov, i){

    const type =mov>0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date"></div>
      <div class="movements__value">${mov.toFixed(2)}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
}



const calcDisplayBalance = function (acc){
  const balance = acc.movements.reduce((acc, mov)=> acc+mov, 0);
  acc.balance=balance;
  labelBalance.textContent = `${balance.toFixed(2)} EUR`;
};


const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov>0).reduce((acc, mov) => acc+mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}EUR`;

  const out = acc.movements.filter(mov => mov<0).reduce((acc, mov) => acc+mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}EUR`

  const interest = acc.movements
    .filter(mov =>  mov>0)
    .map(deposit => (deposit * acc.interestRate)/100)
    .filter((inte, i, arr)=>{
      //console.log(arr);
      return inte>=1;
    })
  .reduce((acc, inte)=> acc+inte, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}EUR`;
}
//calcDisplaySummary(account1.movements);
const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name=>name[0])
    .join('');
  });
};
createUsernames(accounts);
//console.log(accounts);


const updateUI = function(acc){
  displayMovements(acc);
    calcDisplayBalance(acc);
    calcDisplaySummary(acc);
}


const startLogOutTimer=function(){
  let time= 300;
   timer=setInterval(function(){
    const min = String(Math.trunc(time/60)).padStart(2, 0);
    const sec = String(time%60).padStart(2, 0);
    labelTimer.textContent=`${min}:${sec}`;
    
    if(time==0){
      clearInterval(timer);
      labelWelcome.textContent='Log in to get started'
      containerApp.style.opacity=0;
    }
    time--;

  }, 1000)


  


}


//Event Handeler
let currAccount, timer;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();

  currAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value);

  if(currAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back,  ${currAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    startLogOutTimer();
    updateUI(currAccount);
    
  }
});



btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount= Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiveAcc);

  if(amount >0 && receiveAcc && currAccount.balance >= amount && receiveAcc?.username !== currAccount.username){
    currAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    updateUI(currAccount); 

    clearInterval(timer);
    timer=startLogOutTimer();

  }
  inputTransferAmount.value = inputTransferTo.value = '';
});










const now = new Date();
const day = now.getDate();
const month = now.getMonth()+1;
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`;

//Doubt
// btnLoan.addEventListener('click', function(e){
//   e.preventDefault;

//   const amount = Number(inputLoanAmount.value);

//   if(amount>0 && currAccount.movements.some(mov => mov >= amount/10)){
//     currAccount.movements.push(amount);
//     //updateUI(currAccount);
    
//   }
//   inputLoanAmount.value = '';
//    clearInterval(timer);
//     timer=startLogOutTimer;
// })

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
    
  //console.log("index");
  if(inputCloseUsername.value === currAccount.username && Number(inputClosePin.value) === currAccount.pin){

    const index = accounts.findIndex(
      acc => acc.username === currAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
   
    
});

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  
  displayMovements(currAccount, !sorted);
  sorted = !sorted;
})










/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//
// /////////////////////////////////////////////////
//
//
// // let arr = ['a', 'b','c', 'd', 'e'];
// // console.log(arr.slice(2, 4));
//
//
//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//
// for(const [i,move] of movements.entries()){
//   if(move>0){
//     console.log(`Movement ${i+1}: You deposited ${move}`);
//   }else{
//     console.log(`Movement ${i+1}: You withdrew ${-1*move}`);
//   }
// }
//
//  console.log('----------------------------------');
//
//  movements.forEach(function(move, i, arr){
//    if(move>0){
//      console.log(`Movement ${i+1}: You deposited ${move}`);
//    }else{
//      console.log(`Movement ${i+1}: You withdrew ${-1*move}`);
//    }
//  });
//
//
//
// //  const currencies = new Map([
// //    ['USD', 'United States dollar'],
// //    ['EUR', 'Euro'],
// //    ['GBP', 'Pound sterling'],
// //  ]);
// //
// //
// // currencies.forEach(function(value, key, map){
// //   console.log(`${key}: ${value}`);
// // })


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const etu = 1.1;
// const movetousd = movements.map(function(mov){
//   return mov*etu;
// })

// console.log(movements);
// console.log(movetousd);

// const movusdfor=[];
// for(const mov of movements) movusdfor.push(mov*etu);
// console.log(movetousd);

const moveusd = movements.map(mov => mov*etu);


const movementsDis = movements.map((mov, i, arr)=>{
  if(mov>0){
       return `Movement ${i+1}: You deposited ${mov}`;
     }else{
       return `Movement ${i+1}: You withdrew ${-1*mov}`;
     }
});
//console.log(movementsDis);


 const deposites = movements.filter(function(mov){
   return mov>0;
 });
 //console.log(deposites);

const withdrawals = movements.filter(mov => mov<0);
//console.log(withdrawals);

//const etu=1.1;
const totalDepoUSD = movements.filter(mov => mov>0).map(mov => mov*etu).reduce((acc, mov) => acc+mov, 0)

 //console.log(totalDepoUSD);


const firstWithdrawal=movements.find(mov => mov<0)


// const arr = [[1,[2,3]], 4, 5, [6,7,8]];
// console.log(arr);
// console.log(arr.flat());

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// console.log(accountMovements.flat());

const movemen=[2,6,3,8,456,3,63, 63];
//console.log(movemen);

movemen.sort((a,b) =>{
  if(a > b){
    return 1;
  }
  if(b>a){
    return -1;
  }
})

//console.log(movemen);

// const arr = new Array(7);
// console.log(arr);
// arr.fill(1);
// console.log(arr);

//console.log(Number.parseInt('1011', 2));


// console.log(Math.sqrt(25));
// console.log(25 ** (1/2));
// console.log(8 **(1/3));
// console.log(Math.PI);
// console.log(Math.trunc(-23.3));
// console.log(Math.trunc(-23.9));

//console.log(new Date());


setTimeout(()=>console.log("sjkh"), 5000);