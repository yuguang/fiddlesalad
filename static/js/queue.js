var CircularQueueItem = function(value, next, back) {
    this.next = next;
    this.value = value;
    this.back = back;
    return this;
};

var CircularQueue = function(queueLength){
    /// <summary>Creates a circular queue of specified length</summary>
    /// <param name="queueLength" type="int">Length of the circular queue</type>
    this._current = new CircularQueueItem(undefined, undefined, undefined);
    var item = this._current;
    for(var i = 0; i < queueLength - 1; i++)
    {
        item.next = new CircularQueueItem(undefined, undefined, item);
        item = item.next;
    }
    item.next = this._current;
    this._current.back = item;
}

CircularQueue.prototype.push = function(value){
    /// <summary>Pushes a value/object into the circular queue</summary>
    /// <param name="value">Any value/object that should be stored into the queue</param>
    this._current.value = value;
    this._current = this._current.next;
};

CircularQueue.prototype.pop = function(){
    /// <summary>Gets the last pushed value/object from the circular queue</summary>
    /// <returns>Returns the last pushed value/object from the circular queue</returns>
    this._current = this._current.back;
    return this._current.value;
};