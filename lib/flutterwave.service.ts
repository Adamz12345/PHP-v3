import axios from 'axios'
import crypto from 'crypto'

interface FlutterwaveConfig {
  publicKey: string
  secretKey: string
  encryptionKey: string
  environment: 'staging' | 'production'
}

interface PaymentPayload {
  amount: number | string
  currency: string
  customer: {
    email: string
    name?: string
    phone_number?: string
  }
  tx_ref: string
  redirect_url: string
  customizations?: {
    title?: string
    description?: string
    logo?: string
  }
  meta?: Record<string, any>
  payment_options?: string
  country?: string
}

interface FlutterwaveResponse {
  status: string
  message: string
  data?: any
}

interface TransactionVerificationResponse {
  status: string
  data: {
    id: number
    tx_ref: string
    flw_ref: string
    device_fingerprint: string
    amount: number
    charged_amount: number
    app_fee: number
    merchant_fee: number
    processor_response: string
    auth_model: string
    currency: string
    ip_address: string
    narration: string
    status: string
    payment_type: string
    created_at: string
    account_id: number
    customer: {
      id: number
      name: string
      email: string
      customer_code: string
    }
  }
}

class FlutterwaveService {
  private baseURL = 'https://api.flutterwave.com/v3'
  private config: FlutterwaveConfig

  constructor(config: FlutterwaveConfig) {
    this.config = config
  }

  /**
   * Initialize payment with Flutterwave
   */
  async initiatePayment(payload: PaymentPayload): Promise<string> {
    try {
      const response = await axios.post<FlutterwaveResponse>(
        `${this.baseURL}/payments`,
        {
          ...payload,
          customer: {
            email: payload.customer.email,
            name: payload.customer.name || 'Customer',
            phone_number: payload.customer.phone_number || '',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.status === 'success' && response.data.data?.link) {
        return response.data.data.link
      }

      throw new Error(response.data.message || 'Failed to initiate payment')
    } catch (error: any) {
      throw new Error(`Payment initiation failed: ${error.message}`)
    }
  }

  /**
   * Verify transaction status
   */
  async verifyTransaction(
    transactionId: string | number
  ): Promise<TransactionVerificationResponse> {
    try {
      const response = await axios.get<TransactionVerificationResponse>(
        `${this.baseURL}/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
          },
        }
      )

      return response.data
    } catch (error: any) {
      throw new Error(
        `Transaction verification failed: ${error.message}`
      )
    }
  }

  /**
   * Get transaction by reference
   */
  async getTransactionByReference(
    txRef: string
  ): Promise<TransactionVerificationResponse> {
    try {
      const response = await axios.get<TransactionVerificationResponse>(
        `${this.baseURL}/transactions/verify_by_reference`,
        {
          params: { reference: txRef },
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
          },
        }
      )

      return response.data
    } catch (error: any) {
      throw new Error(
        `Failed to get transaction: ${error.message}`
      )
    }
  }

  /**
   * Create checksum for webhook verification
   */
  createChecksum(payload: any): string {
    const serialized = JSON.stringify(payload)
    return crypto
      .createHash('sha256')
      .update(serialized + this.config.encryptionKey)
      .digest('hex')
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: any,
    signature: string
  ): boolean {
    const computedSignature = this.createChecksum(payload)
    return computedSignature === signature
  }

  /**
   * Generate unique transaction reference
   */
  generateTransactionRef(prefix: string = 'TXN'): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${prefix}_${timestamp}_${random}`
  }

  /**
   * Get Flutterwave public key
   */
  getPublicKey(): string {
    return this.config.publicKey
  }

  /**
   * Get Flutterwave configuration
   */
  getConfig(): FlutterwaveConfig {
    return this.config
  }
}

export default FlutterwaveService
export type { FlutterwaveConfig, PaymentPayload, FlutterwaveResponse, TransactionVerificationResponse }
