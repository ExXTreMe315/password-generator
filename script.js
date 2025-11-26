// Character sets for password generation
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBER_CHARS = '0123456789'
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|:,.<>?'

// DOM Elements
const passwordInput = document.getElementById('password')
const generateBtn = document.getElementById('generate-btn')
const copyBtn = document.getElementById('copy-btn')
const lengthSlider = document.getElementById('length')
const lengthValue = document.getElementById('length-value')
const uppercaseCheckbox = document.getElementById('uppercase')
const lowercaseCheckbox = document.getElementById('lowercase')
const numbersCheckbox = document.getElementById('numbers')
const specialCheckbox = document.getElementById('special')

// All checkboxes array for easy iteration
const checkboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, specialCheckbox]

/**
 * Generate a random password based on current settings
 * @returns {string} The generated password
 */
function generatePassword() {
    const length = parseInt(lengthSlider.value)
    let charset = ''
    const requiredChars = []

    // Build character set based on selected options
    if (uppercaseCheckbox.checked) {
        charset += UPPERCASE_CHARS
        requiredChars.push(getRandomChar(UPPERCASE_CHARS))
    }
    if (lowercaseCheckbox.checked) {
        charset += LOWERCASE_CHARS
        requiredChars.push(getRandomChar(LOWERCASE_CHARS))
    }
    if (numbersCheckbox.checked) {
        charset += NUMBER_CHARS
        requiredChars.push(getRandomChar(NUMBER_CHARS))
    }
    if (specialCheckbox.checked) {
        charset += SPECIAL_CHARS
        requiredChars.push(getRandomChar(SPECIAL_CHARS))
    }

    // If no options selected (shouldn't happen due to checkbox logic), use all
    if (charset === '') {
        charset = UPPERCASE_CHARS + LOWERCASE_CHARS + NUMBER_CHARS + SPECIAL_CHARS
    }

    // Generate password
    let password = ''
    
    // First, add required characters to ensure at least one from each selected type
    for (const char of requiredChars) {
        password += char
    }
    
    // Fill the rest with random characters from the combined charset
    for (let i = password.length i < length i++) {
        password += getRandomChar(charset)
    }
    
    // Shuffle the password to randomize position of required characters
    password = shuffleString(password)
    
    return password
}

/**
 * Get a random character from a string
 * @param {string} str - The string to get a random character from
 * @returns {string} A random character
 */
function getRandomChar(str) {
    const randomIndex = Math.floor(Math.random() * str.length)
    return str[randomIndex]
}

/**
 * Shuffle a string using Fisher-Yates algorithm
 * @param {string} str - The string to shuffle
 * @returns {string} The shuffled string
 */
function shuffleString(str) {
    const arr = str.split('')
    for (let i = arr.length - 1 i > 0 i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.join('')
}

/**
 * Update checkbox states to ensure at least one remains checked
 * Disables a checkbox if it's the only one checked
 */
function updateCheckboxStates() {
    const checkedCount = checkboxes.filter(cb => cb.checked).length
    
    checkboxes.forEach(checkbox => {
        if (checkedCount === 1 && checkbox.checked) {
            // Disable the only checked checkbox to prevent unchecking
            checkbox.disabled = true
        } else {
            // Enable all other checkboxes
            checkbox.disabled = false
        }
    })
}

/**
 * Copy password to clipboard and show feedback
 */
async function copyToClipboard() {
    const password = passwordInput.value
    if (!password) return
    
    try {
        await navigator.clipboard.writeText(password)
        showToast('Password copied to clipboard!')
    } catch (err) {
        // Fallback for older browsers
        try {
            passwordInput.select()
            const success = document.execCommand('copy')
            if (success) {
                showToast('Password copied to clipboard!')
            } else {
                showToast('Failed to copy password')
            }
        } catch (fallbackErr) {
            showToast('Failed to copy password')
        }
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 */
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast')
    if (existingToast) {
        existingToast.remove()
    }
    
    // Create and show new toast
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.textContent = message
    document.body.appendChild(toast)
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10)
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => toast.remove(), 300)
    }, 2000)
}

/**
 * Update the length display value
 */
function updateLengthDisplay() {
    lengthValue.textContent = lengthSlider.value
}

// Event Listeners
generateBtn.addEventListener('click', () => {
    passwordInput.value = generatePassword()
})

copyBtn.addEventListener('click', copyToClipboard)

lengthSlider.addEventListener('input', () => {
    updateLengthDisplay()
    passwordInput.value = generatePassword()
})

// Add change listeners to all checkboxes
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateCheckboxStates()
        // Regenerate password when options change
        passwordInput.value = generatePassword()
    })
})

// Initialize
updateCheckboxStates()
passwordInput.value = generatePassword()
