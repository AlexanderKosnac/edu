<script>
    const MONTHS_IFC = {
         1: "January",
         2: "February",
         3: "March",
         4: "April",
         5: "May",
         6: "June",
         7: "Sol",
         8: "July",
         9: "August",
        10: "September",
        11: "October",
        12: "November",
        13: "December",
    };

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    function getDayOfYear(gregorianDate) {
        const year = gregorianDate.getFullYear();
        const start = new Date(year, 0, 0);
        const diff = gregorianDate - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    function dayOfYearInIfc(dayOfYear, isLeapYear) {
        return {
            day: ((dayOfYear - 1) % 28) + 1,
            month: Math.floor((dayOfYear - 1) / 28) + 1,
            isYearDay: dayOfYear === 365,
            isLeapDay: isLeapYear && dayOfYear === 366
        }
    }

    function setDateToToday() {
        dateInput = (new Date()).toISOString().split("T")[0];
    }

    let dateInput = "2000-01-01";
    setDateToToday();

    let selectedDate, day, dateIsLeapYear, ifc;
    $: {
        selectedDate = new Date(dateInput);
        day = getDayOfYear(selectedDate);
        dateIsLeapYear = isLeapYear(selectedDate.getFullYear());
        ifc = dayOfYearInIfc(day, dateIsLeapYear);
    }
</script>

<div class="row">
    <div class="col-auto">
        <table class="date-overview-table">
            <tbody>
                <tr>
                    <th>Gregorian:</th>
                    <td class="d-flex flex-row gap-1 text-nowrap align-items-center">
                        <input type="date" class="form-control" bind:value={dateInput}/>
                        (Day {day})
                        <button type="button" class="btn btn-sm btn-primary" onclick={setDateToToday}>Today</button>
                    </td>
                </tr>
                <tr>
                    <th>IFC:</th>
                    <td>{ifc.day} {MONTHS_IFC[ifc.month]}</td>
                </tr>
            </tbody>
        </table>

        <table class="table table-bordered calendar mt-3">
            <thead>
                <tr>
                    <th scope="col">Sun</th>
                    <th scope="col">Mon</th>
                    <th scope="col">Tue</th>
                    <th scope="col">Wed</th>
                    <th scope="col">Thu</th>
                    <th scope="col">Fri</th>
                    <th scope="col">Sat</th>
                </tr>
            </thead>
            <tbody>
                {#each [0, 7, 14, 21] as i}
                <tr>
                    {#each {length: 7} as _, j}
                        {@const itDay = i+j+1}
                    <td class:today={itDay == ifc.day}>{itDay}</td>
                    {/each}
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/International_Fixed_Calendar" target="_blank">International Fixed Calendar</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Gregorian_calendar" target="_blank">Gregorian Calendar</a></li>
        </ul>
    </div>
</div>

<style>
    .calendar {
        max-width: 400px;
    }
    .today {
        font-weight: 900;
        background-color: red;
    }
    .date-overview-table > tbody > tr, td {
        padding: 5px;
        vertical-align: middle;
    }
</style>