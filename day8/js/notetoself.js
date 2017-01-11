window.onload = init;

function init(){
  var button = document.getElementById('add_button');
  button.onclick = createSticky;

  var input = document.getElementById('note_text');
  input.addEventListener('keypress',function(e){
    e.preventDefault();
    if (e.keyCode == 13){
      button.click();
      input.value = '';
    }

  });

  templateStickers();
  var stickiesArray = getstickiesArray();

  for (var i = 0; i < stickiesArray.length; i++) {
    var key = stickiesArray[i];
    var stickyObj = JSON.parse(localStorage[key]);
    addStickyToDOM(key, stickyObj);
  }
}

function getstickiesArray(){
  var stickiesArray = localStorage['stickiesArray'];
  if (!stickiesArray) {
    stickiesArray = [];
    localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));
  } else {
    stickiesArray = JSON.parse(stickiesArray)
  }
  return stickiesArray;
}


function addStickyToDOM(key, stickyObj){
  var stickies = document.getElementById('stickies');
  var sticky = document.createElement('li');
  sticky.setAttribute("id",key);

  sticky.style.backgroundColor = stickyObj.color;

  var span = document.createElement('span');
  span.setAttribute('class','sticky');
  span.innerHTML = stickyObj.value;

  sticky.appendChild(span);
  stickies.appendChild(sticky);
  sticky.onclick = deleteSticky;
}


function createSticky(){
  var stickiesArray = getstickiesArray();
  var currentDate = new Date();
  var colorSelectedObj = document.getElementById('note_color');
  var index = colorSelectedObj.selectedIndex;
  var color = colorSelectedObj[index].value;

  var key = "sticky_" + currentDate.getTime();
  var value = document.getElementById('note_text').value;

  if (value.trim() == '') {
    return;
  }

  var stickyObj = {
    'value': value,
    'color': color
  }

  localStorage.setItem(key, JSON.stringify(stickyObj));
  stickiesArray.push(key);
  localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));

  addStickyToDOM(key, stickyObj);
}

function deleteSticky(e){
  var key = e.target.id;
  if (e.target.tagName.toLowerCase() == 'span') {
    key = e.target.parentNode.id;
  }

  var todelete = confirm('Are you sure you want to delete the note?')
  if (todelete == false)
    return;

  localStorage.removeItem(key);
  var stickiesArray = getstickiesArray();
  if (stickiesArray) {
    for (var i = 0; i < stickiesArray.length; i++) {
      if (key == stickiesArray[i]) {
        stickiesArray.splice(i,1);
      }
    }
    localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray))
    removeStickyFromDOM(key);
  }
}


function removeStickyFromDOM(key){
  var sticky = document.getElementById(key);
  sticky.parentNode.removeChild(sticky);
}

// these work as templates, will init as instructions
function templateStickers(){
  var stickiesArray = getstickiesArray();

  sticky_0_key = 'sticky_0';
  sticky_0_val = {"value":"选取颜色来添加对应的sticker","color":"LightGoldenRodYellow"}

  sticky_1_key = 'sticky_1';
  sticky_1_val = {"value":"如果完成可以点击sticker来删除","color":"PaleGreen"};

  sticky_2_key = 'sticky_2';
  sticky_2_val = {"value":"这是一个应用localStorage的例子","color":"LightPink"};

  sticky_3_key = 'sticky_3';
  sticky_3_val = {"value":"重启我也在哦👍","color":"LightBlue"};

  stickiesArray = [sticky_0_key,sticky_1_key,sticky_2_key,sticky_3_key];
  localStorage.setItem('stickiesArray',JSON.stringify(stickiesArray));


  localStorage.setItem(sticky_0_key,JSON.stringify(sticky_0_val));
  localStorage.setItem(sticky_1_key,JSON.stringify(sticky_1_val));
  localStorage.setItem(sticky_2_key,JSON.stringify(sticky_2_val));
  localStorage.setItem(sticky_3_key,JSON.stringify(sticky_3_val));
}
