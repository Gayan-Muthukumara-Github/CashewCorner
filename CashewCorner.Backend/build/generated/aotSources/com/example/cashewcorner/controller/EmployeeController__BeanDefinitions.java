package com.example.cashewcorner.controller;

import com.example.cashewcorner.service.EmployeeService;
import com.example.cashewcorner.service.PayrollService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link EmployeeController}.
 */
@Generated
public class EmployeeController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'employeeController'.
   */
  private static BeanInstanceSupplier<EmployeeController> getEmployeeControllerInstanceSupplier() {
    return BeanInstanceSupplier.<EmployeeController>forConstructor(EmployeeService.class, PayrollService.class)
            .withGenerator((registeredBean, args) -> new EmployeeController(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'employeeController'.
   */
  public static BeanDefinition getEmployeeControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(EmployeeController.class);
    beanDefinition.setInstanceSupplier(getEmployeeControllerInstanceSupplier());
    return beanDefinition;
  }
}
