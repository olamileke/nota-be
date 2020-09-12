
const formatNotes = notes => {
    return notes.map(note => {
        const formattedNote = { ...note };
        const length = formattedNote.versions.length;
        formattedNote.content = formattedNote.versions[length - 1].content;
        formattedNote.versions = length;
        return formattedNote;
    })
}

module.exports = formatNotes;