
module.exports = content => {
    
    let [ wordOne, wordTwo, wordThree, ...rest ] = content.split(' ');

    const splits = wordOne.split('>');
    wordOne = splits[splits.length - 1];
    let title;

    if(!wordTwo && !wordThree) {
        title = content.slice(3,6);
    }
    else if(!wordTwo || !wordThree) {
        title = wordOne.slice(0, 3); 
    }
    else {
        if(wordThree.charAt(0) == '<') {
            title = wordOne.charAt(0) + wordTwo.charAt(0) + wordTwo.charAt(1);
        }
        else {
            title = wordOne.charAt(0) + wordTwo.charAt(0) + wordThree.charAt(0);
        }
    }

    return title.toLowerCase();
}