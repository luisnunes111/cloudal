class History {
  constructor() {
    this._index = 0;
    this._stack = [];
    this._pageHash = "";
    this._currentPage = {};
  }

  foward() {
    if (this._stack.length >= 1 && this._index < this._stack.length - 1) {
      this._index += 1;

      this._navigate();
    }
  }

  /**
   * Redirects the user to the last page visited
   */
  back() {
    if (this._stack.length > 0 && this._index - 1 >= 0) {
      this._index -= 1;
      //   if (this._pageHash === page.constructor.name) return null; //evitar redirects para a mesma página
      this._navigate();
    }
  }

  /**
   * Saves the visited page in the stack, on top
   * @page type Function, page Constructor
   * @state type Object, arguments for the constructor
   */
  //   save(page, state) {
  //     this._setCurrentPage(page, state);
  //     this._pageHash = page.name;
  //   }

  /**
   * Redirects the user to the page passed on the "param" attribute
   * @page type Function, page Constructor
   * @state type Object, arguments for the constructor
   * @cb type Function, on redirect success
   */
  redirect(page, state, cb) {
    this._pageHash = page.name;
    const currentPage = this._setCurrentPage({
      constructor: page,
      state: state,
      onComplete: cb
    });
    this._stack.push(currentPage);
    this._index = this._stack.length - 1;

    new page(state);
    return cb && cb();
  }

  _navigate() {
    const page = this._stack[this._index];
    this._setCurrentPage(page);

    new page.constructor(page.state);
    return page.onComplete && page.onComplete();
  }

  /**
   * Returns the state associated with the topmost page of the stack
   */
  getCurrentPage() {
    return this._currentPage;
  }

  /**
   * Sets the page associated with the topmost page of the stack
   */
  _setCurrentPage(page) {
    this._currentPage = page;

    return this._currentPage;
  }
}

module.exports = new History();
