let dragItem = document.getElementById('dragItem');
let divs = document.querySelectorAll('div')
console.log(divs)
let div = document.querySelector('div')
console.log(div)

divs.forEach(dropZone => {
  dropZone.addEventListener('dragover', (e) => {
    console.log(e);
    e.preventDefault();
    dropZone.appendChild(dragItem);
    let span = document.getElementById("talaj")
    span.innerHTML = ""
  });

  dropZone.addEventListener('dragover', () => {
    dropZone.classList.add('hoverOver');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hoverOver');
  });

});

dragItem.addEventListener('drag', () => {
  dragItem.classList.add('beingDragged');
})


dragItem.addEventListener('dragend', () => {
  dragItem.classList.remove('beingDragged');
})
