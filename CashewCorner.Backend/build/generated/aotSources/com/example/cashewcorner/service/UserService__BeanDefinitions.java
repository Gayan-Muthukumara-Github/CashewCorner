package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.RoleRepository;
import com.example.cashewcorner.repository.UserRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Bean definitions for {@link UserService}.
 */
@Generated
public class UserService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'userService'.
   */
  private static BeanInstanceSupplier<UserService> getUserServiceInstanceSupplier() {
    return BeanInstanceSupplier.<UserService>forConstructor(UserRepository.class, RoleRepository.class, PasswordEncoder.class)
            .withGenerator((registeredBean, args) -> new UserService(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'userService'.
   */
  public static BeanDefinition getUserServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(UserService.class);
    beanDefinition.setInstanceSupplier(getUserServiceInstanceSupplier());
    return beanDefinition;
  }
}
