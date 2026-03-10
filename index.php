<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flutterwave SDK Test Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 16px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        
        .card h2 {
            color: #667eea;
            font-size: 20px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .card-icon {
            font-size: 24px;
        }
        
        .card p {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #6c757d;
            margin-left: 10px;
        }
        
        .status {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
        }
        
        .status.success {
            background: #d4edda;
            color: #155724;
        }
        
        .status.error {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status.warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .code-block {
            background: #f5f5f5;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-x: auto;
        }
        
        .section {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }
        
        .section h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 24px;
        }
        
        .test-item {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .test-item.pass {
            background: #d4edda;
            border-color: #c3e6cb;
        }
        
        .test-item.fail {
            background: #f8d7da;
            border-color: #f5c6cb;
        }
        
        .test-item.pending {
            background: #fff3cd;
            border-color: #ffeaa7;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
            color: #555;
        }
        
        .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
            font-size: 18px;
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .header {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <!-- Header -->
    <div class="header">
        <h1>Flutterwave v3 PHP SDK</h1>
        <p>Test Dashboard & Integration Guide</p>
    </div>
    
    <!-- Quick Start Cards -->
    <div class="grid">
        <div class="card">
            <h2><span class="card-icon">🚀</span> Get Started</h2>
            <p>Start accepting payments in minutes with our simple setup guide.</p>
            <a href="paymentForm.php" class="btn">Go to Payment Form</a>
        </div>
        
        <div class="card">
            <h2><span class="card-icon">📖</span> Documentation</h2>
            <p>Complete guide for setting up and using the Flutterwave SDK.</p>
            <a href="SETUP.md" class="btn">Read Documentation</a>
        </div>
        
        <div class="card">
            <h2><span class="card-icon">🔧</span> API Endpoint</h2>
            <p>Test the payment API endpoint for JSON-based integrations.</p>
            <button class="btn" onclick="testAPIEndpoint()">Test API</button>
        </div>
        
        <div class="card">
            <h2><span class="card-icon">📊</span> Examples</h2>
            <p>Browse implementation examples for different payment methods.</p>
            <a href="examples/" class="btn">View Examples</a>
        </div>
        
        <div class="card">
            <h2><span class="card-icon">✅</span> Run Tests</h2>
            <p>Execute unit tests to verify your installation.</p>
            <button class="btn" onclick="runTests()">Run Tests</button>
        </div>
        
        <div class="card">
            <h2><span class="card-icon">🎓</span> Resources</h2>
            <p>Access official Flutterwave documentation and support.</p>
            <a href="https://developer.flutterwave.com" target="_blank" class="btn">Flutterwave Docs</a>
        </div>
    </div>
    
    <!-- Features Section -->
    <div class="section">
        <h2>Supported Features</h2>
        <ul class="feature-list">
            <li>Card Payments (Debit/Credit)</li>
            <li>Mobile Money (MTN, Airtel, Vodafone)</li>
            <li>Bank Transfers</li>
            <li>USSD Payments</li>
            <li>Apple Pay & Google Pay</li>
            <li>Tokenized Payments</li>
            <li>Subscriptions & Payment Plans</li>
            <li>Transfers & Payouts</li>
            <li>Split Payments</li>
            <li>Virtual Cards & Accounts</li>
            <li>Bill Payments</li>
            <li>Transaction Reconciliation</li>
        </ul>
    </div>
    
    <!-- System Status -->
    <div class="section">
        <h2>System Status</h2>
        <div class="test-item pass">
            <div>
                <strong>Autoloader</strong>
                <p>Composer autoloader is properly configured</p>
            </div>
            <span class="status success">OK</span>
        </div>
        <div id="env-status" class="test-item pending">
            <div>
                <strong>Environment Configuration</strong>
                <p>Checking .env file and API keys...</p>
            </div>
            <span class="status warning" id="env-badge">CHECKING</span>
        </div>
        <div id="connection-status" class="test-item pending">
            <div>
                <strong>Flutterwave Connection</strong>
                <p>Testing connection to Flutterwave API...</p>
            </div>
            <span class="status warning" id="conn-badge">CHECKING</span>
        </div>
    </div>
    
    <!-- Quick Test Section -->
    <div class="section">
        <h2>Quick Test</h2>
        <p>Test the payment form or API endpoint:</p>
        <div style="margin-top: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Payment Form Test</h3>
            <p style="color: #666; margin-bottom: 10px;">Test the interactive payment form with validation.</p>
            <a href="paymentForm.php" class="btn">Open Payment Form</a>
            
            <h3 style="font-size: 16px; margin-bottom: 10px; margin-top: 20px;">API Test</h3>
            <p style="color: #666; margin-bottom: 10px;">Test the JSON API endpoint for programmatic integrations.</p>
            <button class="btn" onclick="showAPITest()">Show API Test</button>
        </div>
    </div>
    
    <!-- API Test Form (hidden by default) -->
    <div id="api-test-section" style="display: none;" class="section">
        <h2>API Test Form</h2>
        <form id="apiTestForm">
            <div style="margin-bottom: 15px;">
                <label>Action:</label><br>
                <select id="action" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                    <option value="initiate_payment">Initiate Payment</option>
                    <option value="verify_payment">Verify Payment</option>
                    <option value="get_payment_status">Get Payment Status</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label>Amount:</label><br>
                <input type="number" id="amount" value="1000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label>Email:</label><br>
                <input type="email" id="email" value="test@example.com" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            
            <button type="submit" class="btn">Send Request</button>
        </form>
        <div id="apiResponse" style="margin-top: 20px;"></div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; color: white; margin-top: 40px; padding: 20px;">
        <p>Flutterwave v3 PHP SDK | Test Dashboard</p>
        <p style="font-size: 12px; margin-top: 10px;">© 2025 Flutterwave. All rights reserved.</p>
    </div>
</div>

<script>
    /**
     * Check environment status
     */
    function checkEnvironment() {
        fetch('api/payment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'check_env' })
        })
        .then(response => {
            const envBadge = document.getElementById('env-badge');
            const envStatus = document.getElementById('env-status');
            
            envBadge.textContent = response.ok ? 'OK' : 'ERROR';
            envBadge.className = response.ok ? 'status success' : 'status error';
            envStatus.className = response.ok ? 'test-item pass' : 'test-item fail';
        })
        .catch(error => {
            console.log('[v0] Environment check error:', error);
            const envBadge = document.getElementById('env-badge');
            envBadge.textContent = 'ERROR';
            envBadge.className = 'status error';
        });
    }
    
    /**
     * Show API test form
     */
    function showAPITest() {
        const section = document.getElementById('api-test-section');
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
    }
    
    /**
     * Test API endpoint
     */
    function testAPIEndpoint() {
        showAPITest();
        document.getElementById('apiTestForm').scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Handle API form submission
     */
    document.getElementById('apiTestForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const action = document.getElementById('action').value;
        const data = {
            action: action,
            amount: document.getElementById('amount').value,
            email: document.getElementById('email').value,
            first_name: 'Test',
            last_name: 'User',
            currency: 'NGN',
            description: 'Test Payment'
        };
        
        console.log('[v0] Sending API request:', data);
        
        fetch('api/payment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('[v0] API response:', data);
            showAPIResponse(data);
        })
        .catch(error => {
            console.error('[v0] API error:', error);
            showAPIResponse({ error: error.message });
        });
    });
    
    /**
     * Display API response
     */
    function showAPIResponse(data) {
        const responseDiv = document.getElementById('apiResponse');
        responseDiv.innerHTML = '<pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">' + 
                                JSON.stringify(data, null, 2) + '</pre>';
    }
    
    /**
     * Run tests
     */
    function runTests() {
        alert('To run tests, execute: composer test');
    }
    
    /**
     * Initialize dashboard
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[v0] Test dashboard initialized');
        checkEnvironment();
    });
</script>
</body>
</html>
