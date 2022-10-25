let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");


let modalPriorityColor = colors[colors.length-1];
let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketsArr = [];

if(localStorage.getItem("saved_tickets")) {
    //retrieve and display tickets

    ticketsArr = JSON.parse(localStorage.getItem("saved_tickets"));
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
    })
}

for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
                return currentToolBoxColor == ticketObj.ticketColor ;
        })

        //remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0; i<allTicketsCont.length; i++)
        {
            allTicketsCont[i].remove();
        }

        //display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })
    toolBoxColors[i].addEventListener("dblclick", (e) => {
        //remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0; i<allTicketsCont.length; i++)
        {
            allTicketsCont[i].remove();
        }

        ticketsArr.forEach((ticketObj, idx) => 
        {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })
}

//event listener for modal priority coloring
//border is toggling
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border"); 
        })
        colorElem.classList.add("border");

        modalPriorityColor = colorElem.classList[0];

    })
})

addBtn.addEventListener("click" , (e) => {
    //display modal

    //generate ticket

    //addFlag=true, display modal

    //addFlad=false, remove modal
    addFlag= !addFlag;
    if(addFlag)
    {
        modalCont.style.display="flex";
    }
    else{
        modalCont.style.display = "none";
    }
})

//toggling
removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
})


modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key=="Shift")
    {
        createTicket(modalPriorityColor, textareaCont.value);
        addFlag=false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketId) {
    let id = ticketId || shortid();

    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `

    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock"> 
                <i class="fa-solid fa-lock"></i>
    </div>
    `
    ;

    mainCont.appendChild(ticketCont);

    if(!ticketId)
    {
    //create object of ticket and add to array
    ticketsArr.push({ticketColor, ticketTask, ticketId:id}); 
    localStorage.setItem("saved_tickets", JSON.stringify(ticketsArr));
    }

    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}

function handleRemoval(ticket, id)
{
   // removeFlag is true then remove
   ticket.addEventListener("click", (e)=> {

     if(!removeFlag) return;

    //db removal 
    let idx = getTicketIdx(id);
    ticketsArr.splice(idx, 1);
    let stringsTicketsArr = JSON.stringify(ticketsArr);
    localStorage.setItem("saved_tickets", stringsTicketsArr);
    ticket.remove(); //ui removal 
   
    })
}

function handleLock(ticket, id)
{
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskarea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskarea.setAttribute("contenteditable", "true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskarea.setAttribute("contenteditable", "false");
        }

        //modify data in local storage 
        ticketsArr[ticketIdx].ticketTask = ticketTaskarea.innerText;
        localStorage.setItem("saved_tickets", JSON.stringify(ticketsArr));
    })
}

//changing priority of a task
function handleColor(ticket, id)
{
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => 
    {
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        //get ticket color index
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor == color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx%colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        //modify data in local storage
        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("saved_tickets", JSON.stringify(ticketsArr));
})

}

function getTicketIdx(id)
{
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketId == id;
    })
    return ticketIdx;
}

function setModalToDefault() {
    modalCont.style.display = "none";
    modalPriorityColor = colors[colors.length-1];
    textareaCont.value="";
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border"); 
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}