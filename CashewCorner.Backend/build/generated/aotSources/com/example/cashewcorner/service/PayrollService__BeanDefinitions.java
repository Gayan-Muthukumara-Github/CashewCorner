package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.EmployeeRepository;
import com.example.cashewcorner.repository.PayrollRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link PayrollService}.
 */
@Generated
public class PayrollService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'payrollService'.
   */
  private static BeanInstanceSupplier<PayrollService> getPayrollServiceInstanceSupplier() {
    return BeanInstanceSupplier.<PayrollService>forConstructor(PayrollRepository.class, EmployeeRepository.class)
            .withGenerator((registeredBean, args) -> new PayrollService(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'payrollService'.
   */
  public static BeanDefinition getPayrollServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(PayrollService.class);
    beanDefinition.setInstanceSupplier(getPayrollServiceInstanceSupplier());
    return beanDefinition;
  }
}
