
const game = new Phaser.Game(800, 600, Phaser.AUTO,
  'phaser-example',
   { preload: preload, create: create , update: update});
   function preload()
    {    
    game.load.image('basic_inventory_bg', 'assets/skies/deepblue.png');}
    let headings;
    let atext;
    let atext2;
    let inventory_group;
    let inventory_open = false;
    let inventory_key;
    let inventory = [];
    function loadInventory() {    
     headings = ['name', 'damage', 'speed', 'description'],
     items = {
       '0': {'name': 'firesword','damage': '3','speed': '1','description': 'firesword' },
       '1': {'name': 'watersword','damage': '4','speed': '1','description': 'watersword' },
       '2': {'name': 'windswrord','damage': '6','speed': '2','description': 'windswrord' },
       '3': {'name': 'landsword','damage': '6','speed': '3','description': 'landsword' },
     }
      addItemToInventory(items[0])
      addItemToInventory(items[3])
      console.log(returnInventoryItemsAsList())
      inventory_key = game.input.keyboard.addKey(Phaser.Keyboard.I);
      inventory_key.onDown.add(inventory_start);
      inventory_clear_key = game.input.keyboard.addKey(Phaser.Keyboard.C);
      inventory_clear_key.onDown.add(inventory_clear);
      inventory_add_key = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
      inventory_add_key.onDown.add(inventory_add);
     }
function inventory_clear()
{
inventory = [];
}
function inventory_add()
{
addItemToInventory(items[1])
addItemToInventory(items[2])
}
function addItemToInventory(item){
inventory.push(item)
}
function returnInventoryItemsAsList() {
 return inventory.map(
 function(item)
 {
 return headings.map(    
 function(key){
   console.log(item[key])
   return item[key]
 }
 )
 }
 )
 }
   function inventory_start(){
     if (inventory_open){
     inventory_group.destroy();
     inventory_open = false;
     }
     else{
     let style = { font: "10px Courier", fill: "#fff", tabs: [ 150, 110, 60 ] };
     let inv_bg = game.add.sprite(0,0, 'basic_inventory_bg');
     atext = game.add.text(inv_bg.position.x, inv_bg.position.y, '', style);
     atext = addParseList(atext);
     atext.parseList(headings);
     atext2 = game.add.text(inv_bg.position.x+30, inv_bg.position.y+30, '', style);
     atext2 = addParseList(atext2);
     atext2.parseList(returnInventoryItemsAsList());
     inventory_group = game.add.group();
     inventory_group.add(inv_bg);
     inventory_group.add(atext);
     inventory_group.add(atext2);
     inventory_open = true;
     }
   }
   function create()
   {    
   loadInventory()
   }
function update(textObject){
   textObject.parseList =
   function (list)
   {
   if (!Array.isArray(list))
   {
   return this;
   }
   else
   {
   let s = "";
   for (let i = 0; i < list.length; i++)
   {
   if (Array.isArray(list[i]))
   {
   s += list[i].join("\t");
     if (i < list.length - 1)
     {
     s += "\n";
     }
   }
   else
   {
   s += list[i];
   if (i < list.length - 1)
   {
   s += "\t";
   }
   }
   }
   }
   this.text = s;
   this.dirty = true;
   return this;
   };
   return textObject;
}

