package com.emailagent.service.impl;

import com.emailagent.dto.CustomerRequest;
import com.emailagent.entity.Customer;
import com.emailagent.exception.ResourceNotFoundException;
import com.emailagent.mapper.CustomerMapper;
import com.emailagent.repository.CustomerRepository;
import com.emailagent.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer createCustomer(CustomerRequest request) {
        Customer customer = CustomerMapper.toEntity(request);
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        CustomerMapper.updateEntity(customer, request);
        return customerRepository.save(customer);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        customerRepository.delete(customer);
    }
}
