package org.springframework.boot.actuate.autoconfigure.endpoint.web;

import java.lang.SuppressWarnings;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.actuate.autoconfigure.endpoint.expose.IncludeExcludeEndpointFilter;
import org.springframework.boot.actuate.endpoint.EndpointAccessResolver;
import org.springframework.boot.actuate.endpoint.web.ExposableServletEndpoint;
import org.springframework.boot.actuate.endpoint.web.ServletEndpointRegistrar;
import org.springframework.boot.actuate.endpoint.web.annotation.ServletEndpointsSupplier;
import org.springframework.boot.autoconfigure.web.servlet.DispatcherServletPath;
import org.springframework.core.ResolvableType;

/**
 * Bean definitions for {@link ServletEndpointManagementContextConfiguration}.
 */
@Generated
public class ServletEndpointManagementContextConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'servletEndpointManagementContextConfiguration'.
   */
  public static BeanDefinition getServletEndpointManagementContextConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ServletEndpointManagementContextConfiguration.class);
    beanDefinition.setInstanceSupplier(ServletEndpointManagementContextConfiguration::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'servletExposeExcludePropertyEndpointFilter'.
   */
  private static BeanInstanceSupplier<IncludeExcludeEndpointFilter> getServletExposeExcludePropertyEndpointFilterInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<IncludeExcludeEndpointFilter>forFactoryMethod(ServletEndpointManagementContextConfiguration.class, "servletExposeExcludePropertyEndpointFilter", WebEndpointProperties.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.actuate.autoconfigure.endpoint.web.ServletEndpointManagementContextConfiguration", ServletEndpointManagementContextConfiguration.class).servletExposeExcludePropertyEndpointFilter(args.get(0)));
  }

  /**
   * Get the bean definition for 'servletExposeExcludePropertyEndpointFilter'.
   */
  @SuppressWarnings("removal")
  public static BeanDefinition getServletExposeExcludePropertyEndpointFilterBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(IncludeExcludeEndpointFilter.class);
    beanDefinition.setTargetType(ResolvableType.forClassWithGenerics(IncludeExcludeEndpointFilter.class, ExposableServletEndpoint.class));
    beanDefinition.setFactoryBeanName("org.springframework.boot.actuate.autoconfigure.endpoint.web.ServletEndpointManagementContextConfiguration");
    beanDefinition.setInstanceSupplier(getServletExposeExcludePropertyEndpointFilterInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Bean definitions for {@link ServletEndpointManagementContextConfiguration.WebMvcServletEndpointManagementContextConfiguration}.
   */
  @Generated
  public static class WebMvcServletEndpointManagementContextConfiguration {
    /**
     * Get the bean definition for 'webMvcServletEndpointManagementContextConfiguration'.
     */
    public static BeanDefinition getWebMvcServletEndpointManagementContextConfigurationBeanDefinition(
        ) {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(ServletEndpointManagementContextConfiguration.WebMvcServletEndpointManagementContextConfiguration.class);
      beanDefinition.setInstanceSupplier(ServletEndpointManagementContextConfiguration.WebMvcServletEndpointManagementContextConfiguration::new);
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'servletEndpointRegistrar'.
     */
    @SuppressWarnings("removal")
    private static BeanInstanceSupplier<ServletEndpointRegistrar> getServletEndpointRegistrarInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<ServletEndpointRegistrar>forFactoryMethod(ServletEndpointManagementContextConfiguration.WebMvcServletEndpointManagementContextConfiguration.class, "servletEndpointRegistrar", WebEndpointProperties.class, ServletEndpointsSupplier.class, DispatcherServletPath.class, EndpointAccessResolver.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.actuate.autoconfigure.endpoint.web.ServletEndpointManagementContextConfiguration$WebMvcServletEndpointManagementContextConfiguration", ServletEndpointManagementContextConfiguration.WebMvcServletEndpointManagementContextConfiguration.class).servletEndpointRegistrar(args.get(0), args.get(1), args.get(2), args.get(3)));
    }

    /**
     * Get the bean definition for 'servletEndpointRegistrar'.
     */
    @SuppressWarnings("removal")
    public static BeanDefinition getServletEndpointRegistrarBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(ServletEndpointRegistrar.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.actuate.autoconfigure.endpoint.web.ServletEndpointManagementContextConfiguration$WebMvcServletEndpointManagementContextConfiguration");
      beanDefinition.setInstanceSupplier(getServletEndpointRegistrarInstanceSupplier());
      return beanDefinition;
    }
  }
}
