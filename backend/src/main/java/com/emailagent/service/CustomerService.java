package com.emailagent.service;

import com.emailagent.dto.CustomerRequest;
import com.emailagent.entity.Customer;

import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer createCustomer(CustomerRequest request);
    Customer updateCustomer(Long id, CustomerRequest request);
    void deleteCustomer(Long id);
}
