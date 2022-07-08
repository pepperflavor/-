import Phaser from "phaser";

const M_Config = {
    type : Phaser.AUTO,
    parent : "survivalGame",
    width : 32,
    height : 32,
    physics:{
        default : "arcade",
        arcade : {
            debug : true
        }
    },
}