class TextBuffer {
  _buffer = [];
  constructor(source) {
    this._row = 0;
    this._col = 0;
    this.create(source);
    this.mode = "insert";
  }

  scrollToTop() {
    this._row = 0;
  }

  get len() {
    return this.buffer.length;
  }
  get rowLen() {
    return this.currentRow.length;
  }

  rowAt(index) {
    return this.buffer[index];
  }

  get currentRow() {
    return this.buffer[this._row];
  }

  deleteCurrentLine() { }

  scrollY(len = 1) {
    this.start += len;
    this.end += len;
  }

  create(source) {
    this._buffer = source.split("\n");
  }

  get buffer() {
    return this._buffer;
  }

  get currentChar() {
    if (!this.buffer[this._row]) return " ";
    return this.buffer[this._row][this._col] ?? " ";
  }

  addChar(c) {
    if (this._col === this.rowLen) {
      this._buffer[this._row] += c;
    } else {
      const left = this.currentRow.substring(0, this._col);
      const right = this.currentRow.substring(this._col);
      this._buffer[this._row] = `${left}${c}${right}`;
    }
    this.moveX(1);
  }

  removeChar() {
    //
    if (this._col > 0) {
      const left = this.currentRow.substring(0, this._col - 1);
      const right = this.currentRow.substring(this._col);
      this._buffer[this._row] = `${left}${right}`;
      this.moveX(-1);
    } else if (this._col == 0 && this._row > 0) {
      this.moveY(-1);
      this.moveX(this.rowLen);
      this._buffer[this._row] += this._buffer[this._row + 1];
      this._buffer[this._row + 1] = null;
      /*
       * TODO!:
       * */
      this._buffer = this._buffer.filter((each) => each !== null);
    }
  }

  /*
   * split on enter key pressed
   * */
  splitBuffer() {
    const left = this.currentRow.substring(0, this._col);
    const right = this.currentRow.substring(this._col);
    this._buffer[this._row] = left;
    this._buffer.splice(this._row + 1, 0, right);
    this.moveY(1);
    this._col = 0;
  }

  moveColEnd() {
    this._col = this.buffer[this._row].length;
  }

  moveY(pos) {
    if (this._row + pos >= 0 && this._row + pos < this.len - 1) {
      this._row += pos;
    }
  }

  moveX(pos) {
    if (this._col + pos >= 0 && this._col + pos < this.rowLen + 1) {
      this._col += pos;
    }
  }

  input(key) {
    switch (key) {
      case "ArrowLeft":
        return this.moveX(-1);

      case "ArrowRight":
        return this.moveX(1);
      case "ArrowUp":
        return this.moveY(-1);

      case "ArrowDown":
        return this.moveY(1);

      case "Enter":
        return this.splitBuffer();
      case "Escape":
        this.mode = "control";
        return;
      case "Backspace":
        this.removeChar();
        break;
      case "Control":
      case "Meta":
      case "Shift":
      case "NumLock":
        break;

      default:
        if (this.mode === "control") {
          switch (key) {
            case "i":
              this.mode = "insert";
              break;
            case "j":
              this.moveY(1);
              break;
            case "k":
              this.moveY(-1);
            case "l":
            case "e":
              this.moveX(1);
              break;
            case "h":
            case "b":
              this.moveX(-1);
              break;
            case "a":
              this.mode = "insert";
              this.moveX(1);
              break;
            case "o":
              this.moveColEnd();
              this.splitBuffer();
              this.mode = "insert";
              break;
            case "g":
              this.scrollToTop();
              break;
            case "d":
              this.deleteCurrentLine();
              break;
          }

          return;
        }
        this.addChar(key);
    }
  }
}
