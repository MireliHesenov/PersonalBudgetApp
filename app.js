
let header = document.querySelector('header')
let totalBalnce = document.querySelector('.total-balance')
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
let allBtn = document.querySelector('#all');



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
    inactive([weeklyBtn,monthlyBtn,allBtn]);
    filterForDaily();
 
})
weeklyBtn.addEventListener('click',(e)=>{
    active(weeklyBtn)
    inactive([dailyBtn,monthlyBtn,allBtn]);
    filterForWeekly();
  
})
monthlyBtn.addEventListener('click',(e)=>{
    active(monthlyBtn)
    inactive([dailyBtn,weeklyBtn,allBtn]);
    filterForMonthly();
   
})
allBtn.addEventListener('click',(e)=>{
    active(allBtn)
    inactive([dailyBtn,weeklyBtn,monthly]);
    updateUI()
    
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
    let randomID = Date.now()
    let category = document.querySelector('#category').value;
    let note = document.querySelector('textarea').value
    let entryType = entryScreen.classList.contains('income') ?  'income' : 'expense' ;  
    setDate()
    if(entryInput.value == ''){
        infoMessage(message = 'Please , fill in the gap' , 'error')
        return false        
    }
    let entry = {
        type : entryType ,
        id:randomID,
        value : parseInt(entryInput.value) ,
        category,
        date : setDate(),
        note
        

    }
    console.log(entry)
    ENTRY_LIST.push(entry)
    localStorage.setItem('entry_list',JSON.stringify(ENTRY_LIST));
    updateUI()
    infoMessage(message = `New ${entryType} added` , 'succes')

    entryInput.value = ''

})

function updateUI(list = ENTRY_LIST){

    let income =  calculateTotal('income',list);
    let outcome = calculateTotal('expense',list);
    let balance = Math.abs(income - outcome);

    let sign = (income > outcome ) ? '$' : '-$';
    clearElement(entryList)
    totalIncomes.innerText = `$${income}` ;
    totalExpenses.innerText = `-$${outcome}` ;
    totalBalnce.innerText = `${sign}${balance}`

    showEntry(list)
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

function showEntry(list){
    list.forEach((entry) =>{
    let sign = entry.type=='income' ? '$': '-$';
    let entryEl = document.createElement('li');
    entryEl.classList = `entry ${entry.type}`;
    entryEl.setAttribute('id', entry.id);
    entryEl.setAttribute('onclick' , `showEntryDetail(${entry.id})`)
    
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
    let minute = date.getMinutes()

    return {year,month,day,hour,minute}
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
    let currenTime = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes());
    let entryDate = Date.UTC(entry.date.year , entry.date.month , entry.date.day , entry.date.hour, entry.date.minute);
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
function infoMessage(message , messageType){
    const info = document.createElement('div');
    info.classList = `info-message ${messageType}`;
    info.innerText = `${message}`;
    entryScreen.prepend(info)
    setTimeout(() => {
        document.querySelector('.info-message').remove()
    }, 1000);

}
function showEntryDetail(id){
    let entry = ENTRY_LIST.find(element =>  element.id == id)
    let entryDate = `${entry.date.year}.${entry.date.month}.${entry.date.day}  ${entry.date.hour}:${entry.date.minute} `
    const entryEl = document.createElement('div');
    entryEl.classList.add('entry-info');
    entryEl.innerHTML = `
    <div class="header">
    <a href="#" onclick="this.closest('.entry-info').remove()">Cancel</a>
    <div class="title">
    <i class="fas fa-${icons[entry.category]}"></i>
    ${entry.category}
    </div>
    <a href="#" onclick="removeEntry(${entry.id})">Remove</a>
    </div>
    <div class='detail'>
    <div class ='note'>
    ${entry.note}
    </div>
    <div class="date">${entryDate}</div>
    <div class='amount ${entry.type}'>
    $${entry.value}
    </div>
    
    `
    document.querySelector('body').append(entryEl)
    console.log(entryEl);
    
}

function removeEntry(id){
    var index = ENTRY_LIST.indexOf( ENTRY_LIST.find(element =>  element.id == id));
    ENTRY_LIST.splice(index,1);
    localStorage.setItem('entry_list',JSON.stringify(ENTRY_LIST))
    updateUI()
}