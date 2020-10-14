
let totalIncomes = document.querySelector('.total-incomes');
let totalExpenses = document.querySelector('.total-expenses');
let entryList = document.querySelector('.list');

let addBtn = document.querySelector('#add-btn');
let cancelBtn = document.querySelector('#cancel-btn');
let doneBtn = document.querySelector('#done-btn');
let toggleBtn = document.querySelector('.toggle-btn');



let entryScreen = document.querySelector('.entry-screen');
let entryInput = document.querySelector('#entry');

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];

let icons = {
   'Food' : 'assets/'    
}


addBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    
    entryScreen.style.margin = '0'
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
    
    if(entryInput.value == '')return 
    let entry = {
        type : entryType ,
        value : parseInt(entryInput.value) ,
        category
    }
    console.log(entry)
    ENTRY_LIST.push(entry)
    updateUI()
    
})

function updateUI(){

    let income =  calculateTotal('income',ENTRY_LIST);
    let outcome = calculateTotal('expense',ENTRY_LIST);
    let balance = Math.abs(income - outcome);

    let sign = (income > outcome ) ? '$' : '-$';

    totalIncomes.innerText = `$${income}` ;
    totalExpenses.innerText = `-$${outcome}` ;

    showEntry()

    localStorage.setItem('entry_list',JSON.stringify(ENTRY_LIST));

}

function calculateTotal(type , list){
    let sum = 0 ;

    list.forEach(entry =>{
        if(entry.type == type){
            sum += entry.value;
            console.log(sum)
        }
    })

    return sum ;
}

function showEntry(){
    ENTRY_LIST.forEach((entry,index) =>{
    let sign = entry.type=='income' ? '$': '-$'; 
      let html = ` <li class="entry ${entry.type}" id="${index}">
                    <div class="entry-description">
                        <div class="entry-icon">
                            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 13H5.5V17H1.5V6.8L8 2L14.5 6.8V17H10.5V13Z" stroke="#65BCBF" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                        </div>
                        ${entry.category}
                    </div>

                    <div class="value">${sign}${entry.value}</div>
                </li>`
    
    entryList.innerHTML += html;
            })

}

