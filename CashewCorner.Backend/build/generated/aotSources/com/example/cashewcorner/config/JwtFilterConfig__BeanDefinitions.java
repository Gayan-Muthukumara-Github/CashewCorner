package com.example.cashewcorner.config;

import com.example.cashewcorner.service.AuthService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ConfigurationClassUtils;

/**
 * Bean definitions for {@link JwtFilterConfig}.
 */
@Generated
public class JwtFilterConfig__BeanDefinitions {
  /**
   * Get the bean definition for 'jwtFilterConfig'.
   */
  public static BeanDefinition getJwtFilterConfigBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(JwtFilterConfig.class);
    beanDefinition.setTargetType(JwtFilterConfig.class);
    ConfigurationClassUtils.initializeConfigurationClass(JwtFilterConfig.class);
    beanDefinition.setInstanceSupplier(JwtFilterConfig$$SpringCGLIB$$0::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'jwtAuthenticationFilter'.
   */
  private static BeanInstanceSupplier<JwtAuthenticationFilter> getJwtAuthenticationFilterInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<JwtAuthenticationFilter>forFactoryMethod(JwtFilterConfig$$SpringCGLIB$$0.class, "jwtAuthenticationFilter", AuthService.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("jwtFilterConfig", JwtFilterConfig.class).jwtAuthenticationFilter(args.get(0)));
  }

  /**
   * Get the bean definition for 'jwtAuthenticationFilter'.
   */
  public static BeanDefinition getJwtAuthenticationFilterBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(JwtAuthenticationFilter.class);
    beanDefinition.setFactoryBeanName("jwtFilterConfig");
    beanDefinition.setInstanceSupplier(getJwtAuthenticationFilterInstanceSupplier());
    return beanDefinition;
  }
}
