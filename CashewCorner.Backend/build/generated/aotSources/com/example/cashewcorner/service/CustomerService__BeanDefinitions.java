package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.CustomerRepository;
import com.example.cashewcorner.repository.SalesOrderRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link CustomerService}.
 */
@Generated
public class CustomerService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'customerService'.
   */
  private static BeanInstanceSupplier<CustomerService> getCustomerServiceInstanceSupplier() {
    return BeanInstanceSupplier.<CustomerService>forConstructor(CustomerRepository.class, SalesOrderRepository.class)
            .withGenerator((registeredBean, args) -> new CustomerService(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'customerService'.
   */
  public static BeanDefinition getCustomerServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CustomerService.class);
    beanDefinition.setInstanceSupplier(getCustomerServiceInstanceSupplier());
    return beanDefinition;
  }
}
