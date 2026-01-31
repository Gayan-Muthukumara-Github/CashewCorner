package com.example.cashewcorner.config;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ConfigurationClassUtils;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Bean definitions for {@link SecurityConfig}.
 */
@Generated
public class SecurityConfig__BeanDefinitions {
  /**
   * Get the bean definition for 'securityConfig'.
   */
  public static BeanDefinition getSecurityConfigBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SecurityConfig.class);
    beanDefinition.setTargetType(SecurityConfig.class);
    ConfigurationClassUtils.initializeConfigurationClass(SecurityConfig.class);
    beanDefinition.setInstanceSupplier(SecurityConfig$$SpringCGLIB$$0::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'passwordEncoder'.
   */
  private static BeanInstanceSupplier<PasswordEncoder> getPasswordEncoderInstanceSupplier() {
    return BeanInstanceSupplier.<PasswordEncoder>forFactoryMethod(SecurityConfig$$SpringCGLIB$$0.class, "passwordEncoder")
            .withGenerator((registeredBean) -> registeredBean.getBeanFactory().getBean("securityConfig", SecurityConfig.class).passwordEncoder());
  }

  /**
   * Get the bean definition for 'passwordEncoder'.
   */
  public static BeanDefinition getPasswordEncoderBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(PasswordEncoder.class);
    beanDefinition.setFactoryBeanName("securityConfig");
    beanDefinition.setInstanceSupplier(getPasswordEncoderInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'corsConfigurationSource'.
   */
  private static BeanInstanceSupplier<CorsConfigurationSource> getCorsConfigurationSourceInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<CorsConfigurationSource>forFactoryMethod(SecurityConfig$$SpringCGLIB$$0.class, "corsConfigurationSource")
            .withGenerator((registeredBean) -> registeredBean.getBeanFactory().getBean("securityConfig", SecurityConfig.class).corsConfigurationSource());
  }

  /**
   * Get the bean definition for 'corsConfigurationSource'.
   */
  public static BeanDefinition getCorsConfigurationSourceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CorsConfigurationSource.class);
    beanDefinition.setFactoryBeanName("securityConfig");
    beanDefinition.setInstanceSupplier(getCorsConfigurationSourceInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'filterChain'.
   */
  private static BeanInstanceSupplier<SecurityFilterChain> getFilterChainInstanceSupplier() {
    return BeanInstanceSupplier.<SecurityFilterChain>forFactoryMethod(SecurityConfig$$SpringCGLIB$$0.class, "filterChain", HttpSecurity.class, JwtAuthenticationFilter.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("securityConfig", SecurityConfig.class).filterChain(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'filterChain'.
   */
  public static BeanDefinition getFilterChainBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SecurityFilterChain.class);
    beanDefinition.setFactoryBeanName("securityConfig");
    beanDefinition.setInstanceSupplier(getFilterChainInstanceSupplier());
    return beanDefinition;
  }
}
