package com.emailagent.mapper;

import com.emailagent.dto.CustomerRequest;
import com.emailagent.entity.Customer;

public class CustomerMapper {
    public static Customer toEntity(CustomerRequest request) {
        return Customer.builder()
                .name(request.getName())
                .company(request.getCompany())
                .industry(request.getIndustry())
                .email(request.getEmail())
                .jobTitle(request.getJobTitle())
                .country(request.getCountry())
                .interest(request.getInterest())
                .purchaseHistory(request.getPurchaseHistory())
                .build();
    }

    public static void updateEntity(Customer customer, CustomerRequest request) {
        customer.setName(request.getName());
        customer.setCompany(request.getCompany());
        customer.setIndustry(request.getIndustry());
        customer.setEmail(request.getEmail());
        customer.setJobTitle(request.getJobTitle());
        customer.setCountry(request.getCountry());
        customer.setInterest(request.getInterest());
        customer.setPurchaseHistory(request.getPurchaseHistory());
    }
}
