<script>
    let ip = [192, 168, 0, 0];
    let cidrMask = 24;
    $: mask = binaryStringAsDecimal(cidrMaskAsByteString(cidrMask));

    function as3DigitString(n) {
        return `${n}`.padStart(3, "0");
    }

    function cidrMaskAsByteString(cidrMask) {
        return "1".repeat(cidrMask).padEnd(32, "0");
    }

    function binaryStringAsDecimal(str) {
        return [0, 8, 16, 24].map(i => as3DigitString(parseInt(str.slice(i, i+8), 2))).join(".");
    }

    function asByteString(n) {
        return (n >>> 0).toString(2).padStart(8, "0");
    }

    function insertEveryNthChar(str, insertion, n) {
        let newString = "";
        let max = str.length;
        for (let i=0; i<max; i++) {
            newString += str[i];
            if ((i+1) % n == 0 && i != max-1) newString += insertion;
        }
        return newString;
    }

    function operationOnBitString(op, str1, str2) {
        let max = Math.max(str1.length, str2.length);
        let result = "";
        for (let i=0; i<max; i++) {
            result += op(str1[i] ?? "0", str2[i] ?? "0");
        }
        return result;
    }

    const AND = (a, b) => a === "1" && b === "1" ? "1" : "0";
    const OR = (a, b) => a === "1" || b === "1" ? "1" : "0";
    const NOT = (a, _) => a === "1" ? "0" : "1";

    $: ipDecimalString = ip.map(it => as3DigitString(it)).join(".");
    $: ipBinaryString = ip.map(it => asByteString(it)).join("");
    $: maskBinaryString = cidrMaskAsByteString(cidrMask);
    $: maskInvBinaryString = operationOnBitString(NOT, maskBinaryString, "");

    $: net = operationOnBitString(AND, ipBinaryString, maskBinaryString);
    $: broadcast = operationOnBitString(OR, ipBinaryString, maskInvBinaryString);
    $: host = operationOnBitString(AND, ipBinaryString, maskInvBinaryString);
    $: availableHosts = 2**(32-cidrMask) - 2;
</script>

<svelte:head>
    <title>IPv4 Subnetting</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>IPv4 Subnetting</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex gap-1 fw-bold">
            <input type="number" min="0" max="255" bind:value={ip[0]}/>.
            <input type="number" min="0" max="255" bind:value={ip[1]}/>.
            <input type="number" min="0" max="255" bind:value={ip[2]}/>.
            <input type="number" min="0" max="255" bind:value={ip[3]}/>/
            <input type="number" min="0" max="32" bind:value={cidrMask}/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <table class="table min">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Decimal</th>
                    <th scope="col">Binary</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>IP-Address</td>
                    <td><tt>{ipDecimalString}</tt></td>
                    <td><tt>{insertEveryNthChar(ipBinaryString, ".", 8)}</tt></td>
                </tr>
                <tr>
                    <td>Subnetmask</td>
                    <td><tt>{mask}</tt></td>
                    <td><tt>{insertEveryNthChar(maskBinaryString, ".", 8)}</tt></td>
                </tr>
                <tr>
                    <td>Net Address</td>
                    <td><tt>{binaryStringAsDecimal(net)}</tt></td>
                    <td><tt>{insertEveryNthChar(net, ".", 8)}</tt></td>
                </tr>
                <tr>
                    <td>Broadcast</td>
                    <td><tt>{binaryStringAsDecimal(broadcast)}</tt></td>
                    <td><tt>{insertEveryNthChar(broadcast, ".", 8)}</tt></td>
                </tr>
                <tr>
                    <td>Host Address</td>
                    <td><tt>{binaryStringAsDecimal(host)}</tt></td>
                    <td><tt>{insertEveryNthChar(host, ".", 8)}</tt></td>
                </tr>
            </tbody>
        </table>

        <div>Number of available host addresses: <tt>2^(32-{cidrMask})-2 = {availableHosts}</tt></div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing" target="_blank">Classless Inter-Domain Routing</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Classful_network" target="_blank">Classful network</a></li>
            <li><a href="https://www.elektronik-kompendium.de/sites/net/0907201.htm" target="_blank">Subnetting from Elektronik Kompendium (German)</a></li>
            <li><a href="https://www.elektronik-kompendium.de/sites/net/2011231.htm" target="_blank">CIDR from Elektronik Kompendium (German)</a></li>
        </ul>
    </div>
</div>

<style>
    table {
        width: auto;
        white-space: nowrap;
    }

    table.min {
        width: 1%;
    }
</style>