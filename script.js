// Toggle modal on click

let addBtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-cont');
let textArea = document.querySelector('.textarea-cont');
let mainCont = document.querySelector('.main-cont');
let isModalHidden = true;
let isButtonRed = false;
var uid = new ShortUniqueId();
let allPriorityColor = document.querySelectorAll('.priority-color');
let priorityColor = 'red';
let color = ['red','blue','green','pink'];
let ticketArr = [];

if(localStorage.getItem('TaskArr')){
    let ticketAreaStr = localStorage.getItem('TaskArr');
    ticketArr = JSON.parse(ticketAreaStr);
    for(let i=0;i<ticketArr.length;i++){
        let ticket = ticketArr[i];
        createTicket(ticket.value,ticket.priorityColor,ticket.id);
    }
}

let filterColor = document.querySelectorAll('.color');
for(let i=0;i<filterColor.length;i++){
    filterColor[i].addEventListener('click',function(){
        let allTicketColors = document.querySelectorAll('.ticket-color');
        let selectedColor = filterColor[i].classList[1];
        for(let j=0;j<allTicketColors.length;j++){
            let currentTicketColor = allTicketColors[j].classList[1];
            if(selectedColor == currentTicketColor){
                allTicketColors[j].parentElement.style.display = 'block';
            }
            else{
                allTicketColors[j].parentElement.style.display = 'none';
            }
        }
    })
}

//Set priority color
for(let i=0;i<allPriorityColor.length;i++){
    allPriorityColor[i].addEventListener('click',function(){
        // console.log(allPriorityColor[i]);
        for(let j=0;j<allPriorityColor.length;j++){
            allPriorityColor[j].classList.remove('active');
        }
        allPriorityColor[i].classList.add('active');
        priorityColor = allPriorityColor[i].classList[1];
    })
}

//Show/Hide Modal
addBtn.addEventListener('click',function(){
    if(isModalHidden){
        modalCont.style.display = 'flex';
        isModalHidden = false;
    }
    else{
        modalCont.style.display = 'none';
        isModalHidden = true;
    }
})

//Handle delete button color change
let deleteBtn = document.querySelector('.remove-btn');
deleteBtn.addEventListener('click',function(){
    if(isButtonRed){
        deleteBtn.style.color = 'black';
        isButtonRed = false;
    }
    else{
        deleteBtn.style.color = 'red';
        isButtonRed = true;
    }
})

//Handle enter button to create ticket
textArea.addEventListener('keydown',function(e){
    if(e.key == 'Enter'){
        createTicket(textArea.value,priorityColor);
        modalCont.style.display = 'none';
        isModalHidden = true;
        textArea.value = '';
        // priorityColor = 'red';
    }
})

//Create ticket
function createTicket(task,priorityColor,ticketId){
    let id;
    if(ticketId){
        id = ticketId;
    }
    else{
        id = uid.rnd();
    }
    let ticketContainer = document.createElement('div');
    ticketContainer.className = 'ticket-cont';
    ticketContainer.innerHTML = `<div class="ticket-color ${priorityColor}"></div>
                                <div class="ticket-id">${id}</div>
                                <div class="ticket-area">${task}</div>
                                <div class = 'lock-btn'>
                                    <i class="fa-solid fa-lock"></i>
                                </div>`;
    if(!ticketId){
        ticketArr.push({id:id, priorityColor:priorityColor, value:task});
        let ticketAreaStr = JSON.stringify(ticketArr);
        localStorage.setItem("TaskArr",ticketAreaStr);
    }
    
    mainCont.appendChild(ticketContainer);

    //Handle ticket deletion on click
    ticketContainer.addEventListener('click',function(){
        if(isButtonRed){
            ticketContainer.remove();
            let ticketIndex = ticketArr.findIndex(function(ticketObj){
                return ticketObj.id == id;
            })
            ticketArr.splice(ticketIndex,1);
            updateLocalStorage();
            console.log(ticketArr);
        }
    })

    //Handle ticket lock
    let lockBtn = ticketContainer.querySelector('.lock-btn i');
    let ticketArea = ticketContainer.querySelector('.ticket-area');
    lockBtn.addEventListener('click',function(){
        if(lockBtn.classList.contains('fa-lock')){
            lockBtn.classList.remove('fa-lock');
            lockBtn.classList.add('fa-lock-open');
            ticketArea.setAttribute('contenteditable','true');
        }
        else{
            lockBtn.classList.remove('fa-lock-open');
            lockBtn.classList.add('fa-lock');
            ticketArea.setAttribute('contenteditable','false');
        }
        let ticketIndex = ticketArr.findIndex(function(ticketObj){
            return ticketObj.id == id;
        })
        console.log(ticketIndex);
        ticketArr[ticketIndex].value = ticketArea.innerText;
        updateLocalStorage();
        console.log(ticketArr); 
    })

    //handle priority color change or cyclic change of priority
    let ticketColor = ticketContainer.querySelector('.ticket-color');
    ticketColor.addEventListener('click',function(){
        let currentColor = ticketColor.classList[1];
        // let index;
        // for(let i=0;i<color.length;i++){
        //     if(currentColor == color[i]){
        //         index = i;
        //         break;
        //     }
        // }
        let index = color.findIndex(function(col){
            return col ==currentColor;
        })
        let nextIndex = (index+1)%color.length;
        let nextColor = color[nextIndex];
        ticketColor.classList.remove(currentColor);
        ticketColor.classList.add(nextColor);

        let ticketIndex = ticketArr.findIndex(function(ticketObj){
            return ticketObj.id == id;
        })
        ticketArr[ticketIndex].priorityColor = nextColor;
        console.log(ticketArr);
        updateLocalStorage();
    })

    function updateLocalStorage(){
        let ticketArrStr = JSON.stringify(ticketArr);
        localStorage.setItem("TaskArr",ticketArrStr);
    }
}
