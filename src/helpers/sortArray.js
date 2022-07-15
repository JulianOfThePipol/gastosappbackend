

export function sortArray (array, sortBy, desc){
    if(sortBy === "name") {
        array.sort((a,b) => {
            let na = a.name.toLowerCase();
            let nb = b.name.toLowerCase();

            if (na < nb) {
                return -1
            }
            if (na > nb) {
                return 1
            }
            return 0
        })
        if(desc === "false") {
            array.reverse()
        }
    }

    if(sortBy === "date") {
        array.sort((a,b) => {
            let da = new Date (a.date)
            let db = new Date (b.date)

            return db-da
        })
        if(desc === "false") {
            array.reverse()
        }
    }

    return array
}