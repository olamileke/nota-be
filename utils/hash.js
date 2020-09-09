
exports.hash = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '#';

    for(let i=1; i < 8; i++) {
        hash = hash + characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return hash;
}