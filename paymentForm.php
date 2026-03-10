<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Flutterwave Payment Integration</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            padding: 40px;
            max-width: 600px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .form-section {
            margin-bottom: 25px;
        }
        .form-section label {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            display: block;
            font-size: 14px;
        }
        .form-section input,
        .form-section select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        .form-section input:focus,
        .form-section select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
        }
        .row-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .submit-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 15px;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        .submit-btn:active {
            transform: translateY(0);
        }
        .info-box {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 13px;
            color: #555;
        }
        .info-box code {
            background: #e8ecff;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .error-message {
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
            display: none;
        }
        .form-section.has-error input,
        .form-section.has-error select {
            border-color: #dc3545;
            background-color: #f8d7da;
        }
        .form-section.has-error .error-message {
            display: block;
        }
        .success-alert {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: none;
        }
        @media (max-width: 600px) {
            .row-2 {
                grid-template-columns: 1fr;
            }
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Flutterwave Payment</h1>
        <p>Complete your payment securely</p>
    </div>

    <form method="POST" action="processPayment.php" id="paymentForm">
        <!-- Transaction Details -->
        <div class="form-section">
            <label for="amount">Amount *</label>
            <input type="number" id="amount" name="amount" value="200" min="1" step="0.01" required placeholder="Enter amount">
        </div>

        <div class="form-section">
            <label for="currency">Currency *</label>
            <select id="currency" name="currency" required>
                <option value="NGN">Nigerian Naira (NGN)</option>
                <option value="GHS">Ghanaian Cedi (GHS)</option>
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="ZAR">South African Rand (ZAR)</option>
            </select>
        </div>

        <div class="form-section">
            <label for="description">Description *</label>
            <input type="text" id="description" name="description" value="Payment for Services" required placeholder="Enter transaction description">
        </div>

        <!-- Customer Information -->
        <div class="form-section">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" value="customer@example.com" required placeholder="Enter email address">
        </div>

        <div class="row-2">
            <div class="form-section">
                <label for="first_name">First Name *</label>
                <input type="text" id="first_name" name="first_name" value="John" required placeholder="Enter first name">
            </div>
            <div class="form-section">
                <label for="last_name">Last Name *</label>
                <input type="text" id="last_name" name="last_name" value="Doe" required placeholder="Enter last name">
            </div>
        </div>

        <div class="form-section">
            <label for="phone_number">Phone Number (Optional)</label>
            <input type="tel" id="phone_number" name="phone_number" value="+2348098787676" placeholder="Enter phone number">
        </div>

        <!-- Payment Configuration -->
        <input type="hidden" name="payment_method" value="card">
        <input type="hidden" name="tx_ref" value="<?php echo 'TXREF_' . time() . '_' . uniqid(); ?>">
        <input type="hidden" name="success_url" value="<?php echo 'http://' . $_SERVER['HTTP_HOST'] . '/processPayment.php'; ?>">
        <input type="hidden" name="failure_url" value="<?php echo 'http://' . $_SERVER['HTTP_HOST'] . '/processPayment.php'; ?>">

        <button type="submit" class="submit-btn">Complete Payment</button>
    </form>

    <div class="info-box">
        <strong>Test Mode:</strong> This form is running in <code>staging</code> mode. Use test cards to process payments. Visit the Flutterwave documentation for test card details.
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
        integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
        integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
        crossorigin="anonymous"></script>

<script>
    /**
     * Form Validation Script
     */
    const form = document.getElementById('paymentForm');
    const fields = {
        amount: { required: true, type: 'number', min: 1 },
        currency: { required: true },
        description: { required: true, minLength: 3 },
        email: { required: true, type: 'email' },
        first_name: { required: true, minLength: 2 },
        last_name: { required: true, minLength: 2 },
        phone_number: { required: false, type: 'phone' }
    };

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Validate phone number format
     */
    function isValidPhone(phone) {
        if (!phone) return true; // Optional field
        return /^\+?[0-9]{10,15}$/.test(phone.replace(/[^0-9+]/g, ''));
    }

    /**
     * Validate single field
     */
    function validateField(field) {
        const input = document.getElementById(field.name);
        const value = input.value.trim();
        const config = fields[field.name];
        const formSection = input.closest('.form-section');
        let error = null;

        if (config.required && !value) {
            error = 'This field is required';
        } else if (config.minLength && value.length < config.minLength) {
            error = `Minimum ${config.minLength} characters required`;
        } else if (config.type === 'number' && isNaN(parseFloat(value))) {
            error = 'Please enter a valid number';
        } else if (config.type === 'number' && parseFloat(value) < config.min) {
            error = `Amount must be at least ${config.min}`;
        } else if (config.type === 'email' && value && !isValidEmail(value)) {
            error = 'Please enter a valid email address';
        } else if (config.type === 'phone' && !isValidPhone(value)) {
            error = 'Please enter a valid phone number';
        }

        if (error) {
            formSection.classList.add('has-error');
            let errorDiv = formSection.querySelector('.error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                formSection.appendChild(errorDiv);
            }
            errorDiv.textContent = error;
            errorDiv.style.display = 'block';
            return false;
        } else {
            formSection.classList.remove('has-error');
            let errorDiv = formSection.querySelector('.error-message');
            if (errorDiv) errorDiv.style.display = 'none';
            return true;
        }
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        let isValid = true;
        Object.keys(fields).forEach(fieldName => {
            const field = { name: fieldName };
            if (!validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    /**
     * Real-time validation on blur
     */
    Object.keys(fields).forEach(fieldName => {
        const input = document.getElementById(fieldName);
        if (input) {
            input.addEventListener('blur', () => {
                validateField({ name: fieldName });
            });

            input.addEventListener('input', () => {
                const formSection = input.closest('.form-section');
                if (formSection.classList.contains('has-error')) {
                    validateField({ name: fieldName });
                }
            });
        }
    });

    /**
     * Form submission
     */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            console.log('[v0] Form validation failed');
            return;
        }

        console.log('[v0] Form validation passed, submitting...');
        form.submit();
    });

    /**
     * Initialize form with current date/time for unique tx_ref
     */
    document.addEventListener('DOMContentLoaded', function () {
        console.log('[v0] Payment form initialized');
    });
</script>
</body>
</html>
</script>

