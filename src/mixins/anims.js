

export default {
  isPlayingAnims(animsKey) {
    // debugger
    return this.anims.isPlaying && this.anims.getCurrentKey=== animsKey;
  }
}
