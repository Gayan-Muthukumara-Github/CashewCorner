package org.springframework.boot.autoconfigure.data.jdbc;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link JdbcDataProperties}.
 */
@Generated
public class JdbcDataProperties__BeanDefinitions {
  /**
   * Get the bean definition for 'jdbcDataProperties'.
   */
  public static BeanDefinition getJdbcDataPropertiesBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcDataProperties.class);
    beanDefinition.setInstanceSupplier(JdbcDataProperties::new);
    return beanDefinition;
  }
}
