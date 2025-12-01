package org.springframework.boot.autoconfigure.data.jdbc;

import java.lang.Class;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.ManagedTypes;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.data.jdbc.core.convert.DataAccessStrategy;
import org.springframework.data.jdbc.core.convert.IdGeneratingEntityCallback;
import org.springframework.data.jdbc.core.convert.JdbcConverter;
import org.springframework.data.jdbc.core.convert.JdbcCustomConversions;
import org.springframework.data.jdbc.core.convert.RelationResolver;
import org.springframework.data.jdbc.core.mapping.JdbcMappingContext;
import org.springframework.data.relational.RelationalManagedTypes;
import org.springframework.data.relational.core.dialect.Dialect;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;

/**
 * Bean definitions for {@link JdbcRepositoriesAutoConfiguration}.
 */
@Generated
public class JdbcRepositoriesAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'jdbcRepositoriesAutoConfiguration'.
   */
  public static BeanDefinition getJdbcRepositoriesAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcRepositoriesAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(JdbcRepositoriesAutoConfiguration::new);
    return beanDefinition;
  }

  /**
   * Bean definitions for {@link JdbcRepositoriesAutoConfiguration.JdbcRepositoriesConfiguration}.
   */
  @Generated
  public static class JdbcRepositoriesConfiguration {
    /**
     * Get the bean definition for 'jdbcRepositoriesConfiguration'.
     */
    public static BeanDefinition getJdbcRepositoriesConfigurationBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcRepositoriesAutoConfiguration.JdbcRepositoriesConfiguration.class);
      beanDefinition.setInstanceSupplier(JdbcRepositoriesAutoConfiguration.JdbcRepositoriesConfiguration::new);
      return beanDefinition;
    }
  }

  /**
   * Bean definitions for {@link JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration}.
   */
  @Generated
  public static class SpringBootJdbcConfiguration {
    /**
     * Get the bean instance supplier for 'org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration'.
     */
    private static BeanInstanceSupplier<JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration> getSpringBootJdbcConfigurationInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration>forConstructor(ApplicationContext.class, JdbcDataProperties.class)
              .withGenerator((registeredBean, args) -> new JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration(args.get(0), args.get(1)));
    }

    /**
     * Get the bean definition for 'springBootJdbcConfiguration'.
     */
    public static BeanDefinition getSpringBootJdbcConfigurationBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class);
      beanDefinition.setInstanceSupplier(getSpringBootJdbcConfigurationInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance for 'jdbcManagedTypes'.
     */
    private static InstanceSupplier<RelationalManagedTypes> jdbcManagedTypesInstance() {
      return (registeredBean ->  {
        List<Class<?>> types = Collections.emptyList();
        ManagedTypes managedTypes = ManagedTypes.fromIterable(types);
        return RelationalManagedTypes.from(managedTypes);
      } );
    }

    /**
     * Get the bean definition for 'jdbcManagedTypes'.
     */
    public static BeanDefinition getJdbcManagedTypesBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(RelationalManagedTypes.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(SpringBootJdbcConfiguration.jdbcManagedTypesInstance());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'jdbcMappingContext'.
     */
    private static BeanInstanceSupplier<JdbcMappingContext> getJdbcMappingContextInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<JdbcMappingContext>forFactoryMethod(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class, "jdbcMappingContext", Optional.class, JdbcCustomConversions.class, RelationalManagedTypes.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration", JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class).jdbcMappingContext(args.get(0, Optional.class), args.get(1, JdbcCustomConversions.class), args.get(2, RelationalManagedTypes.class)));
    }

    /**
     * Get the bean definition for 'jdbcMappingContext'.
     */
    public static BeanDefinition getJdbcMappingContextBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcMappingContext.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(getJdbcMappingContextInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'jdbcConverter'.
     */
    private static BeanInstanceSupplier<JdbcConverter> getJdbcConverterInstanceSupplier() {
      return BeanInstanceSupplier.<JdbcConverter>forFactoryMethod(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class, "jdbcConverter", JdbcMappingContext.class, NamedParameterJdbcOperations.class, RelationResolver.class, JdbcCustomConversions.class, Dialect.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration", JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class).jdbcConverter(args.get(0, JdbcMappingContext.class), args.get(1, NamedParameterJdbcOperations.class), args.get(2, RelationResolver.class), args.get(3, JdbcCustomConversions.class), args.get(4, Dialect.class)));
    }

    /**
     * Get the bean definition for 'jdbcConverter'.
     */
    public static BeanDefinition getJdbcConverterBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcConverter.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(getJdbcConverterInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'jdbcCustomConversions'.
     */
    private static BeanInstanceSupplier<JdbcCustomConversions> getJdbcCustomConversionsInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<JdbcCustomConversions>forFactoryMethod(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class, "jdbcCustomConversions")
              .withGenerator((registeredBean) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration", JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class).jdbcCustomConversions());
    }

    /**
     * Get the bean definition for 'jdbcCustomConversions'.
     */
    public static BeanDefinition getJdbcCustomConversionsBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcCustomConversions.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(getJdbcCustomConversionsInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'jdbcAggregateTemplate'.
     */
    private static BeanInstanceSupplier<JdbcAggregateTemplate> getJdbcAggregateTemplateInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<JdbcAggregateTemplate>forFactoryMethod(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class, "jdbcAggregateTemplate", ApplicationContext.class, JdbcMappingContext.class, JdbcConverter.class, DataAccessStrategy.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration", JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class).jdbcAggregateTemplate(args.get(0, ApplicationContext.class), args.get(1, JdbcMappingContext.class), args.get(2, JdbcConverter.class), args.get(3, DataAccessStrategy.class)));
    }

    /**
     * Get the bean definition for 'jdbcAggregateTemplate'.
     */
    public static BeanDefinition getJdbcAggregateTemplateBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JdbcAggregateTemplate.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(getJdbcAggregateTemplateInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'dataAccessStrategyBean'.
     */
    private static BeanInstanceSupplier<DataAccessStrategy> getDataAccessStrategyBeanInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<DataAccessStrategy>forFactoryMethod(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class, "dataAccessStrategyBean", NamedParameterJdbcOperations.class, JdbcConverter.class, JdbcMappingContext.class, Dialect.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration", JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class).dataAccessStrategyBean(args.get(0, NamedParameterJdbcOperations.class), args.get(1, JdbcConverter.class), args.get(2, JdbcMappingContext.class), args.get(3, Dialect.class)));
    }

    /**
     * Get the bean definition for 'dataAccessStrategyBean'.
     */
    public static BeanDefinition getDataAccessStrategyBeanBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(DataAccessStrategy.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(getDataAccessStrategyBeanInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'jdbcDialect'.
     */
    private static BeanInstanceSupplier<Dialect> getJdbcDialectInstanceSupplier() {
      return BeanInstanceSupplier.<Dialect>forFactoryMethod(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class, "jdbcDialect", NamedParameterJdbcOperations.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration", JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class).jdbcDialect(args.get(0, NamedParameterJdbcOperations.class)));
    }

    /**
     * Get the bean definition for 'jdbcDialect'.
     */
    public static BeanDefinition getJdbcDialectBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(Dialect.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(getJdbcDialectInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'idGeneratingBeforeSaveCallback'.
     */
    private static BeanInstanceSupplier<IdGeneratingEntityCallback> getIdGeneratingBeforeSaveCallbackInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<IdGeneratingEntityCallback>forFactoryMethod(JdbcRepositoriesAutoConfiguration.SpringBootJdbcConfiguration.class, "idGeneratingBeforeSaveCallback", JdbcMappingContext.class, NamedParameterJdbcOperations.class, Dialect.class);
    }

    /**
     * Get the bean definition for 'idGeneratingBeforeSaveCallback'.
     */
    public static BeanDefinition getIdGeneratingBeforeSaveCallbackBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(IdGeneratingEntityCallback.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration$SpringBootJdbcConfiguration");
      beanDefinition.setInstanceSupplier(getIdGeneratingBeforeSaveCallbackInstanceSupplier());
      return beanDefinition;
    }
  }
}
