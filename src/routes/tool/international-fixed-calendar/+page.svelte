<script>
    const MONTHS_IFC = {
         0: "January",
         1: "February",
         2: "March",
         3: "April",
         4: "May",
         5: "June",
         6: "Sol",
         7: "July",
         8: "August",
         9: "September",
        10: "October",
        11: "November",
        12: "December",
    }

    const today = new Date();
    const year = today.getFullYear();
    const start = new Date(year, 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);

    const monthIfc = Math.floor(day/28);
    const dayIfc = day%28;
</script>

<svelte:head>
    <title>International Fixed Calendar</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>International Fixed Calendar</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Generic Monthly Layout</h2>
        <table class="table table-bordered calendar">
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
                    <td class:today={itDay == dayIfc}>{itDay}</td>
                    {/each}
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="col">
        <h2>Today in Gregorian:</h2>
        <div class="pb-4">
            {String(today.getDate()).padStart(2, "0")}.{String(today.getMonth()+1).padStart(2, "0")}.{year}
            (Day {day})
        </div>

        <h2>Today in IFC:</h2>
        <div>
            {dayIfc} {MONTHS_IFC[monthIfc]}
        </div>
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
        color: red;
    }
</style>