<?php

namespace Flutterwave\Entities;

use Flutterwave\Contract\EntityInterface;

class Customer implements EntityInterface
{
    private array $data = [];

    public function __construct(array $data = [])
    {
        // Validate that required customer fields are present
        $requiredFields = ['email', 'phone_number'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Customer field '{$field}' is required and cannot be empty.");
            }
        }
        $this->data = [...$data];
    }

    public function get(string $param)
    {
        return $this->data[$param];
    }

    public function set(string $param, $value): void
    {
        $this->data[$param] = $value;
    }

    public function has(string $param): bool
    {
        return isset($this->data[$param]);
    }

    public function toArray(): array
    {
        return $this->data;
    }
}
