
/**
 * Permet de récupérer la date de aujourd'hui
 * @returns     string  todayFormat
 */
function getTodayIso() {
    const today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    let todayFormat = yyyy + '-' + mm + '-' + dd;
    return todayFormat;
}

/**
 * Permet de récupérer la date de aujourd'hui
 * @returns     string  todayFormat
 */
function getTodayFr() {
    const today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    let todayFormat = dd + '/' + mm + '/' + yyyy;
    return todayFormat;
}


