
let header = document.querySelector('header')
let totalIncomes = document.querySelector('.total-incomes');
let totalExpenses = document.querySelector('.total-expenses');
let entryList = document.querySelector('.list');

let addBtn = document.querySelector('#add-btn');
let cancelBtn = document.querySelector('#cancel-btn');
let doneBtn = document.querySelector('#done-btn');
let toggleBtn = document.querySelector('.toggle-btn');

let dailyBtn = document.querySelector('#daily');
let weeklyBtn = document.querySelector('#weekly');
let monthlyBtn = document.querySelector('#monthly');
let yearlyBtn = document.querySelector('#yearly');



let entryScreen = document.querySelector('.entry-screen');
let entryInput = document.querySelector('#entry');

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];

let icons = {
   'Food' : 'pizza-slice',
    'Car' : 'car-side',
    'Electronics' : 'headphones',
    'Education' : 'graduation-cap',
    'Rental' : 'home',
    'Entertainment':'gamepad'
    

}

addBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    
    entryScreen.style.margin = '0'
})
dailyBtn.addEventListener('click',(e)=>{
    active(dailyBtn)
    inactive([weeklyBtn,monthlyBtn,yearlyBtn]);
    filterForDaily();
 
})
weeklyBtn.addEventListener('click',(e)=>{
    active(weeklyBtn)
    inactive([dailyBtn,monthlyBtn,yearlyBtn]);
    filterForWeekly();
  
})
monthlyBtn.addEventListener('click',(e)=>{
    active(monthlyBtn)
    inactive([dailyBtn,weeklyBtn,yearlyBtn]);
    filterForMonthly();
   
})
yearlyBtn.addEventListener('click',(e)=>{
    active(yearlyBtn)
    inactive([dailyBtn,weeklyBtn,monthly]);
    filterForYearly();
    
})

cancelBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    entryScreen.style.margin = '' ;
})
toggleBtn.addEventListener('click',()=>{

    entryScreen.classList.toggle('income')

})

doneBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let category = document.querySelector('#category').value;
    let entryType = entryScreen.classList.contains('income') ?  'income' : 'expense' ;  
    setDate()
    if(entryInput.value == '')return 
    let entry = {
        type : entryType ,
        value : parseInt(entryInput.value) ,
        category,
        date : setDate()

    }
    console.log(entry)
    ENTRY_LIST.push(entry)
    localStorage.setItem('entry_list',JSON.stringify(ENTRY_LIST));
    updateUI()

    entryInput.value = ''
    
})

function updateUI(ENTRY_LIST){

    let income =  calculateTotal('income',ENTRY_LIST);
    let outcome = calculateTotal('expense',ENTRY_LIST);
    let balance = Math.abs(income - outcome);

    let sign = (income > outcome ) ? '$' : '-$';
    clearElement(entryList)
    totalIncomes.innerText = `$${income}` ;
    totalExpenses.innerText = `-$${outcome}` ;

    showEntry()
    updateChart(income,outcome)

    

}

function calculateTotal(type , list){
    let sum = 0 ;

    list.forEach(entry =>{
        if(entry.type == type){
            sum += entry.value;
        }
    })

    return sum ;
}

function showEntry(){
    ENTRY_LIST.forEach((entry,index) =>{
    let sign = entry.type=='income' ? '$': '-$';

    let entryEl = document.createElement('li');
    entryEl.classList = `entry ${entry.type}`;
    entryEl.setAttribute('id',index);
    
    entryEl.innerHTML = ` 
                    <div class="entry-description">
                        <div class="entry-icon">
                            <i class="fas fa-${icons[entry.category]}"></i>
                        </div>
                        ${entry.category}
                    </div>
                    <div class="value">${sign}${entry.value}</div>
                    `

    entryList.append(entryEl)
            })

}

function clearElement(element){

    element.innerHTML = '';

}
function setDate(){
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let hour = date.getHours()

    return {year,month,day,hour}
}

function filterForYearly(){
  
let List = ENTRY_LIST.filter(entry =>{
     return calcDateDif(entry) < 365
    })

    console.log(ENTRY_LIST)
    updateUI(List)
}

function filterForMonthly(){
    
   let List = ENTRY_LIST.filter(entry =>{
     return calcDateDif(entry) < 30
    })

    console.log(ENTRY_LIST)
    updateUI(List)
}
function filterForWeekly(){

    
   let List = ENTRY_LIST.filter(entry =>{
      
      return calcDateDif(entry) < 7
  
      })
      updateUI(List)
}
function filterForDaily(){

    
  let List = ENTRY_LIST.filter(entry =>{
    
   return calcDateDif(entry) < 1

    })

    updateUI(List)
}
function calcDateDif(entry){
    let perDay = 1000 * 60 * 60 * 24;
    let date = new Date()
    let currenTime = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours());
    let entryDate = Date.UTC(entry.date.year , entry.date.month , entry.date.day , entry.date.hour);
    let diff = (currenTime - entryDate) / perDay ;
    console.log(diff)
    return diff
} 

function active(element){
    element.classList.add('active')
}

function inactive(elements){
    elements.forEach(element=>{
        element.classList.remove('active');
    })
}
