/******************************************************
*                    FileSizeFormatter
* @param {Number} bytes
* @param {number} decimal

    bytes is size of the input file
    decimal  =>  How many digit after the '.' notation

* @returns {function}
*******************************************************/

const fileformatter = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    let dm = decimal || 2;
    let sizes = ['Bytes', 'KB', 'MB'];
    let index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

module.exports = {
    fileformatter
}