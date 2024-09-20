class ValidationError {
          constructor(message, field, status) {
                    this.message = message
                    this.field = field
                    this.status = status
                    return {
                              message: this.message,
                              field: this.field,
                              status: this.status
                    }
          }
}

export default ValidationError