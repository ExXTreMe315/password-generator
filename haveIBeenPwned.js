async function haveIBeenPwned(password) {
    const data = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()

    const prefix = hashHex.slice(0, 5)
    const suffix = hashHex.slice(5)

    try {
        const response = await fetch(
            `https://api.pwnedpasswords.com/range/${prefix}`
        )
        if (!response.ok) {
            throw new Error('Error fetching data from Have I Been Pwned API')
        }

        const responseText = await response.text()
        const lines = responseText.split('\n')

        const pwnedMatch = lines.find((line) => {
            const returnedSuffix = line.split(':')[0]
            return returnedSuffix === suffix
        })

        if (pwnedMatch) {
            const count = pwnedMatch.split(':')[1]
            return parseInt(count)
        }

        return 0
    } catch (error) {
        console.error('Error checking password:', error)
        return -1
    }
}
