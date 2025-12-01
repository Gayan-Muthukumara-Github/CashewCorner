package com.example.cashewcorner;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link CashewCornerApplication}.
 */
@Generated
public class CashewCornerApplication__BeanDefinitions {
  /**
   * Get the bean definition for 'cashewCornerApplication'.
   */
  public static BeanDefinition getCashewCornerApplicationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CashewCornerApplication.class);
    beanDefinition.setInstanceSupplier(CashewCornerApplication::new);
    return beanDefinition;
  }
}
