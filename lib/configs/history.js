class History {
  constructor() {
    this._index = 0;
    this._pages = {}; //{guid: page}
    this._history = [];
    this._currentPage = {};
  }

    /**
   * Redirects the user to the next page
   * @cb type Function, on complete
   */
  foward(cb) {
    if (this._history.length >= 1 && this._index+1 < this._history.length-1) {
      this._index += 1;
      
      this._navigate();
      cb && cb();
    }
  }

  /**
   * Redirects the user to the previous page visited
   * @cb type Function, on complete
   */
  back(cb) {
    if (this._history.length > 0 && this._index > 0) {
      this._index -= 1;

      //   if (this._pageHash === page.constructor.name) return null; //evitar redirects para a mesma página
      this._navigate();
      cb && cb();
    }
  }

  /**
   * Redirects the user to the page passed on the @page attribute
   * @page type Function, page Constructor
   * @state type Object, arguments for the constructor
   * @cb type Function, on redirect success
   */
  redirect(page, state, cb) {
    // this._pageHash = page.name;
    const pageId = this.uuidv4();

    //save the page and its state
    this._pages[pageId] = { 
      constructor: page,
      state: state
    }

    this._history.slice(0, this._index) //reset ao foward, não permitir que o user possa dar foward depois do redirect
    this._history.push(pageId); //adicionar 
    this._setCurrentPage(pageId); //página actual
    this._index = this._history.length-1;

    new page(state);
    return cb && cb();
  }

  _navigate() {
    const pageId = this._history[this._index];
    this._history.push(pageId); 
    this._setCurrentPage(pageId);
      
    const page = this._pages[pageId]//get page 
    new page.constructor(page.state);
  }

  /**
   * Returns the state associated with the topmost page of the stack
   */
  getCurrentPage() {
    return this._pages[this._currentPage];
  }

  /**
   * Sets the page associated with the topmost page of the stack
   */
  _setCurrentPage(pageId) {
    this._currentPage = pageId;
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

module.exports = new History();
