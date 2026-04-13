module.exports = [
  {
    slug: "apartment-finder-ai",
    title: "ApartmentFinder AI",
    shortDesc: "A Multi-Agent AI system that simplifies relocation moves — Google ADK, RAG pipelines, and MCP in one coherent product.",
    tags: ["AI Agents", "RAG Pipeline", "MCP", "Google ADK"],
    featured: true,
    isComingSoon: true,
    comingSoonMessage: "ApartmentFinder AI is a multi-agent AI system designed for simplifying the chaos of relocations",
    comingSoonIcon: "fa-book",
    comingSoonCallout: "Give it a read on Kaggle!",
    links: [
      { label: "Kaggle Writeup", url: "https://www.kaggle.com/competitions/agents-intensive-capstone-project/writeups/apartmentfinder-ai", icon: "fa-external-link" },
      { label: "GitHub Repository", url: "https://github.com/tanaymehendale/apartment-finder-AI", icon: "fa-external-link" }
    ]
  },
  {
    slug: "real-time-streaming",
    title: "Real-Time Data Streaming",
    shortDesc: "End-to-end real-time pipeline using Airflow, Kafka, and Spark — built for scale and reliability from source to sink.",
    tags: ["Apache Spark", "Kafka", "Airflow", "Cassandra"],
    featured: true,
    impact: "Building a reproducible real-time pipeline that runs entirely on WSL2 + Docker (9 containers: Airflow web + scheduler + Postgres, Kafka broker + ZooKeeper + Control Center, Spark master + worker, Cassandra)",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>I wanted an end-to-end, locally reproducible streaming system that:
          <ol style="margin-left: 2em;">
            <li>Pulls synthetic user data from a public API,</li>
            <li>Transports it via a durable queue,</li>
            <li>processes it with a streaming engine, and</li>
            <li>persists it in a queryable store.</li>
          </ol>
          Constraints: run on Windows 10 via WSL, no managed services, and keep the setup beginner-friendly.
        </p>`
      },
      {
        title: "Approach",
        content: `<p>I chose a well-known "starter" architecture:
          <ul style="margin-left: 2em;">
            <li>Airflow orchestrates and produces JSON events to Kafka (users_created topic)</li>
            <li>Spark Structured Streaming reads Kafka, parses JSON, and writes to Cassandra.</li>
            <li>Cassandra stores the final table spark_streams.created_users</li>
            <li>Control Center gives me Kafka visibility; Postgres holds Airflow metadata; ZooKeeper coordinates Kafka.</li>
          </ul>
        </p>`
      },
      {
        title: "Methodology",
        content: `<p>This project runs like a small real-time mail system.</p>
        <p>On a schedule, Airflow calls a public "random user" API to generate realistic test records and drops each one as a message onto Kafka, which acts as a reliable queue so nothing gets lost if parts start or stop.</p>
        <p>Spark Structured Streaming continuously reads those messages, cleans and structures the fields (name, email, phone, etc.), and writes the results into Cassandra, a fast database optimized for streaming inserts.</p>
        <p>To keep it frictionless, the Spark job auto-creates the Cassandra keyspace/table on first run, and the Airflow task ensures the Kafka topic exists before producing — so a fresh clone "just works."</p>
        <p>You can verify the flow end-to-end by triggering the Airflow task, watching messages appear in Kafka's UI, and seeing row counts grow in Cassandra.</p>`
      },
      {
        title: "Result",
        content: `<p>A fully working local pipeline that ingests synthetic user events, streams them through Kafka, transforms/parses them in Spark, and lands structured rows in Cassandra.</p>`
      }
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/tanaymehendale/real-time-streaming", icon: "fa-external-link" }
    ]
  },
  {
    slug: "data-warehouse",
    title: "Data Warehouse for Retail Analytics",
    shortDesc: "Comprehensive data warehouse implementation using SQL Server — schema design, ETL pipelines, and a full reporting layer.",
    tags: ["Data Warehousing", "SQL Server", "SSIS", "SSAS", "Tableau"],
    featured: true,
    isAcademicRestricted: true,
    impact: "Built an end-to-end data warehouse solution that reduced data processing time by 63% (from 5.5 to 2.0 hours) and enabled analysis of $600M+ retail sales patterns, leading to optimized inventory management and promotion strategies.",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>Dominick's Fine Foods — a retail business — faced challenges in analyzing their sales patterns, customer behavior, and product performance due to:</p>
          <ul style="margin-left: 2em;">
            <li>Scattered data across multiple sources</li>
            <li>Manual data compilation taking 5+ hours monthly</li>
            <li>Inability to track historical changes in product categories</li>
            <li>Lack of unified view for sales and customer behavior analysis</li>
            <li>Complex requirements for analyzing specific product combinations</li>
          </ul>`
      },
      {
        title: "Approach",
        content: `<ol style="margin-left: 2em;">
          <li>Design two specialized data marts:
            <ul style="margin-left: 2em;">
              <li>Sales Data Mart for product performance analysis</li>
              <li>Store Information Data Mart for customer behavior tracking</li>
            </ul>
          </li>
          <li>Implement robust ETL processes:
            <ul style="margin-left: 2em;">
              <li>Type-2 SCD (Slowly Changing Dimensions) for tracking dimensional changes</li>
              <li>Automated data validation and transformation</li>
              <li>Error handling and logging mechanisms</li>
            </ul>
          </li>
          <li>Develop multi-tool visualization strategy:
            <ul style="margin-left: 2em;">
              <li>SSRS for static holiday season reports</li>
              <li>SSAS cubes for historical trend analysis</li>
              <li>Tableau for interactive dashboards</li>
            </ul>
          </li>
        </ol>`
      },
      {
        title: "Methodology",
        content: `<ol style="margin-left: 2em;">
          <li>Data Mart Implementation:
            <ul style="margin-left: 2em;">
              <li>Created star schema designs for both marts</li>
              <li>Implemented fact tables (factSales, factStoreInfo)</li>
              <li>Developed shared dimensions (dimTime, dimStore)</li>
              <li>Established proper relationships and constraints</li>
            </ul>
          </li>
          <li>ETL Development:
            <ul style="margin-left: 2em;">
              <li>Built SSIS packages for data transformation</li>
              <li>Implemented lookup transformations</li>
              <li>Created derived calculations</li>
              <li>Set up incremental loading</li>
            </ul>
          </li>
          <li>BI Solution Development:
            <ul style="margin-left: 2em;">
              <li>Developed SSAS cubes with calculated measures</li>
              <li>Created named queries for optimization</li>
              <li>Designed specialized visualizations for each business question</li>
              <li>Implemented dual-axis charts for correlation analysis</li>
            </ul>
          </li>
        </ol>`
      },
      {
        title: "Result",
        content: `<p>The solution successfully:</p>
          <ul style="margin-left: 2em;">
            <li>Reduced monthly data processing time from 5.5 to 2.0 hours</li>
            <li>Enabled analysis of 6 years of historical data</li>
            <li>Provided automated tracking of product category changes</li>
            <li>Delivered insights through 5 specialized dashboards</li>
            <li>Created a scalable foundation for future analytics needs</li>
          </ul>`
      }
    ],
    links: [
      { label: "Request Project Files", url: "https://linkedin.com/in/tanay-mehendale", icon: "fa-external-link" }
    ]
  },
  {
    slug: "resqvision",
    title: "ResQVision — Emergency Analytics",
    shortDesc: "Interactive D3.js + React dashboard visualizing 15,000+ emergency incidents to surface response bottlenecks and resource gaps.",
    tags: ["D3.js", "React.js", "Data Visualization", "Python"],
    featured: false,
    impact: "ResQVision visualizes over 15,000+ emergency incidents to uncover operational bottlenecks, environmental risks, and resource shortages, enabling up to 30% faster identification of factors impacting response times.",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>Emergency response management systems generate vast amounts of data — incident types, dispatch times, resource statuses, environmental conditions — but much of this data remains underutilized due to fragmented systems and limited analytic capabilities. Existing dashboards often lack multi-dimensional analysis, incident-level granularity, and dynamic exploration features. Critical questions — such as how weather impacts response times, or how ambulance availability correlates with delays — remain difficult to answer using static reports. Our challenge was to build an interactive, user-friendly dashboard that would surface these hidden relationships, empowering decision-makers to act proactively.</p>`
      },
      {
        title: "Approach",
        content: `<p>We designed ResQVision with a user-centered philosophy focused on clarity, usability, and operational relevance. The dashboard is organized into three modules — Incident Trends, Response Efficiency, and Environmental Impact — each targeting a specific layer of emergency response analysis. We prioritized intuitive interaction models, responsive filtering, and high information density without overwhelming the user. Clear legends, dynamic tooltips, and export functionalities were added to support exploratory analysis while maintaining an accessible learning curve for non-technical users.</p>`
      },
      {
        title: "Methodology",
        content: `<ul style="margin-left: 2em;">
          <li style="margin-left: 2em;"><b>Data Engineering:</b>
            <p>Preprocessing emergency incident data using Python to derive temporal fields (Month, Day of Week, Hour) and enrich records with environmental and infrastructural variables (Weather Condition, Traffic Congestion, Road Type).</p>
          </li>
          <li style="margin-left: 2em;"><b>Visualization Stack:</b>
            <p>Built interactive visualizations using D3.js and React.js, ensuring smooth transitions, dynamic scaling, and modular component structures.</p>
          </li>
          <li style="margin-left: 2em;"><b>Dashboard Design:</b>
            <p>Implemented three distinct dashboards:</p>
            <ol style="margin-left: 2em;">
              <li><b>Incidents Dashboard</b> (Bar charts, Time Series)</li>
              <li><b>Response Analysis Dashboard</b> (Grouped Bar Chart, Line Chart, Heatmap)</li>
              <li><b>Weather Impact Dashboard</b> (Heatmap)</li>
            </ol>
            <p>All dashboards were equipped with global filters (Region, Time Range, Severity, Traffic) to enable comparative and drill-down analysis.</p>
          </li>
          <li style="margin-left: 2em;"><b>Deployment:</b>
            <p>Hosted the live dashboard on Netlify for easy access and demonstration. User feedback was collected via an embedded survey to iteratively refine user experience.</p>
          </li>
        </ul>`
      },
      {
        title: "Result",
        content: `<p>ResQVision successfully transforms complex emergency system data into a cohesive, exploratory environment where users can:</p>
          <ul style="margin-left: 2em;">
            <li>Identify trends in emergency type and severity across time and regions,</li>
            <li>Assess the operational impact of ambulance shortages, road types, and injury scale on response time,</li>
            <li>Uncover how environmental factors like bad weather and traffic congestion exacerbate delays.</li>
          </ul>
          <p>The project serves as a strong proof-of-concept for real-world EMS decision support systems. User feedback indicated high scores for ease of navigation, clarity of insights, and potential usefulness in operational and policy settings.</p>`
      }
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/tanaymehendale/ResQVision", icon: "fa-external-link" },
      { label: "Live Webapp", url: "https://resqvision-dashboard.netlify.app/", icon: "fa-external-link" }
    ]
  },
  {
    slug: "investobuddy",
    title: "Investobuddy",
    shortDesc: "Investment analysis tool combining value investing principles with LSTM + Monte Carlo — buy/sell signals via Flask + Angular.",
    tags: ["LSTM", "PyTorch", "Flask", "Angular", "Monte Carlo"],
    featured: false,
    impact: "Built an investment analysis tool that combined <b>value investing principles with machine learning</b>, enabling more reliable stock buy/sell decisions; achieved <b>forecasting accuracy with LSTM (MAE 0.02, RMSE 0.03)</b> and demonstrated intrinsic valuation on $1T+ market cap companies (Apple, Microsoft)",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>Traditional retail investors lack the time and expertise to assess whether a stock is <b>undervalued or overvalued</b>. Existing approaches often rely on short-term signals, ignoring fundamentals, and offer limited predictive power for long-term decision-making.</p>`
      },
      {
        title: "Approach",
        content: `<p>The development strategy focused on a phased implementation:</p>
          <ul style="margin-left: 2em;">
            <li>Integrate financial fundamentals with machine learning forecasting</li>
            <li>Provide investors with a simple webapp that outputs whether a stock is fairly priced and predicts its near-term trend</li>
            <li>Blend classical valuation (DCF + Monte Carlo Simulation) with modern ML (LSTM, Random Forest)</li>
          </ul>`
      },
      {
        title: "Methodology",
        content: `<h3>Data Collection</h3>
          <ul style="margin-left: 2em;">
            <li>Pulled 5 years of financial and stock market data using Alpha Vantage and Yahoo Finance APIs.</li>
            <li>Extracted key financial ratios (P/E, P/B, Free Cash Flow, D/E, PEG)</li>
          </ul>
          <h3>Valuation</h3>
          <ul style="margin-left: 2em;">
            <li>Applied Discounted Cash Flow (DCF) model</li>
            <li>Ran Monte Carlo simulations to calculate intrinsic value distributions.</li>
          </ul>
          <h3>Forecasting</h3>
          <ul style="margin-left: 2em;">
            <li>Implemented stacked LSTM in PyTorch for 6-month price prediction.</li>
            <li>Benchmarked against Random Forest and logistic regression.</li>
            <li>Evaluated using MAE, RMSE, Accuracy, Precision, Recall, F1.</li>
          </ul>
          <h3>Deployment</h3>
          <ul style="margin-left: 2em;">
            <li>Built a Flask backend + Angular frontend</li>
            <li>Delivered intuitive buy/sell signals and dashboards to end users</li>
          </ul>`
      },
      {
        title: "Result",
        content: `<ul style="margin-left: 2em;">
          <li>Intrinsic Value Analysis: Correctly flagged Apple and Microsoft as overvalued during evaluation period.</li>
          <li>Forecasting: LSTM — MAE 0.0239, RMSE 0.0317 (best performer); Random Forest: Less accurate, but interpretable baseline.</li>
          <li>End-User Impact: Provided actionable buy/sell recommendations in a webapp, simplifying complex financial analysis for non-technical investors.</li>
        </ul>`
      }
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/tanaymehendale/investobuddy/", icon: "fa-external-link" }
    ]
  },
  {
    slug: "customer-churn",
    title: "Customer Churn Analysis in Tableau",
    shortDesc: "Tableau dashboard on 6,687 telecom customer records — churn driver analysis revealing a 26.86% churn rate.",
    tags: ["Tableau", "Business Intelligence", "Data Analysis"],
    featured: false,
    impact: "Through a comprehensive Tableau analysis of 6,687 customer records, this project identified critical churn drivers and revealed that competitor offerings and poor customer service led to a 26.86% churn rate, enabling targeted retention strategies for high-risk segments.",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>The telecommunications company Databel faced a substantial customer retention challenge. With over a quarter of customers churning, understanding the underlying factors driving this behavior became crucial for developing effective retention strategies. The analysis needed to uncover patterns across multiple dimensions including demographics, service usage, and customer satisfaction metrics.</p>`
      },
      {
        title: "Approach",
        content: `<p>I developed a multi-faceted dashboard approach focusing on four key areas:</p>
          <ul style="margin-left: 2em;">
            <li>Overview metrics and geographical distribution of churn</li>
            <li>Demographics and customer grouping patterns</li>
            <li>Data plan usage and international calling behavior</li>
            <li>Payment methods and contract type correlations</li>
          </ul>`
      },
      {
        title: "Analysis",
        content: `<p>I leveraged Tableau to create interconnected visualizations that revealed several critical patterns:</p>
          <ol style="margin-left: 2em;">
            <li><p>The primary reasons for churn were competitor-related, with "competitor made better offer" and "competitor had better devices" being the top two reasons. Customer service issues, particularly the attitude of support personnel, emerged as the third most significant factor.</p></li>
            <li><p>Age-based analysis showed increasing churn rates with age, ranging from 14% in younger demographics to over 50% in the 85+ age bracket. Customers not belonging to any group showed a significantly higher churn rate of 32.85% compared to those in groups.</p></li>
            <li><p>Data plan analysis revealed that unlimited data plan subscribers had consistently higher churn rates across all usage brackets, with rates between 27.72% to 34.71%. International plan usage showed a striking pattern — customers with active international plans but no international usage had a 66.67% churn rate.</p></li>
          </ol>`
      },
      {
        title: "Result",
        content: `<p>The analysis uncovered several actionable insights:</p>
          <ul style="margin-left: 2em;">
            <li>Competitive offerings and device quality were the primary churn drivers</li>
            <li>Customer service quality significantly impacted retention</li>
            <li>Older customers and non-grouped customers were at higher risk of churning</li>
            <li>Unlimited data plans weren't effectively retaining customers</li>
            <li>International plan pricing needed optimization, particularly for non-users</li>
          </ul>`
      }
    ],
    links: [
      { label: "Live Dashboard", url: "/projects/customer-churn/dashboard.html", icon: "fa-external-link" }
    ]
  },
  {
    slug: "fashionmnist-classification",
    title: "Image Classification on FashionMNIST",
    shortDesc: "Compared CNN, KNN, SVM, Logistic Regression, and Decision Trees on 70K fashion images — CNN hitting 91% accuracy.",
    tags: ["PyTorch", "CNN", "scikit-learn", "Machine Learning"],
    featured: false,
    impact: "Successfully developed and compared five different machine learning models for fashion image classification, achieving up to 91% accuracy with CNN while providing a comprehensive analysis of each model's strengths and practical applications.",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>With the growing need for automated fashion item classification in e-commerce and retail, there's a crucial need to understand which machine learning approaches work best for image classification tasks. Using the FashionMNIST dataset with 70,000 grayscale images of clothing items, we aimed to compare traditional machine learning methods against modern deep learning approaches to determine their effectiveness in real-world fashion applications.</p>`
      },
      {
        title: "Approach",
        content: `<p>We planned to implement and compare five distinct models:</p>
          <ul style="margin-left: 2em;">
            <li>Convolutional Neural Network (CNN)</li>
            <li>K-Nearest Neighbors (KNN)</li>
            <li>Logistic Regression</li>
            <li>Support Vector Machine (SVM)</li>
            <li>Decision Trees/Random Forest</li>
          </ul>
          <p>Each model would be evaluated on the same dataset to understand their classification accuracy, computational efficiency, and practical applications.</p>`
      },
      {
        title: "Methodology",
        content: `<ol style="margin-left: 2em;">
          <li>Data Processing:
            <ul style="margin-left: 2em;">
              <li>Utilized 28x28 pixel grayscale images from FashionMNIST</li>
              <li>Split data into training (60,000 images) and testing (10,000 images)</li>
              <li>Applied necessary preprocessing for each model type</li>
            </ul>
          </li>
          <li>Model Implementation:
            <ul style="margin-left: 2em;">
              <li>Built CNN using PyTorch with multiple convolutional layers</li>
              <li>Implemented KNN with optimized K value</li>
              <li>Developed Logistic Regression with multinomial classification</li>
              <li>Created SVM with kernel optimization</li>
              <li>Constructed Decision Trees with appropriate depth</li>
            </ul>
          </li>
          <li>Evaluation:
            <ul style="margin-left: 2em;">
              <li>Measured accuracy, precision, recall, and F1-score</li>
              <li>Created confusion matrices for each model</li>
              <li>Analyzed computational requirements and practical applications</li>
            </ul>
          </li>
        </ol>`
      },
      {
        title: "Result",
        content: `<ul style="margin-left: 2em;">
          <li>CNN achieved highest accuracy at 91%</li>
          <li>Logistic Regression performed well at 84%</li>
          <li>KNN showed strong results at 85%</li>
          <li>SVM demonstrated robust performance at 89%</li>
          <li>Decision Trees achieved reasonable accuracy at 82%</li>
        </ul>
        <p>The project demonstrated that while CNN provides the best accuracy, simpler models like Logistic Regression and KNN offer practical advantages in terms of implementation simplicity and computational efficiency.</p>`
      }
    ],
    links: [
      { label: "Detailed Project Blog", url: "https://akshatowl.github.io/FashionMNISTClassifiers/", icon: "fa-external-link" }
    ]
  },
  {
    slug: "heatmap-visualization",
    title: "Interactive Heatmaps using D3.js",
    shortDesc: "Two-level D3.js heatmap on Observable — Hong Kong temperature trends 1997–2017 with mini in-cell line charts.",
    tags: ["D3.js", "Observable", "Data Visualization"],
    featured: false,
    impact: "This project provides an interactive visualization of Hong Kong's monthly temperatures from 1997 to 2017, enabling users to explore historical temperature trends dynamically. The visualizations offer insights into seasonal temperature variations and daily fluctuations, making them valuable for climate analysis and educational purposes.",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>Hong Kong's monthly temperature data spans decades, but static visualizations fail to convey the nuances of seasonal changes and daily fluctuations effectively. A dynamic, interactive visualization is needed to provide deeper insights into historical temperature patterns across years and months.</p>`
      },
      {
        title: "Approach",
        content: `<p>The project is divided into two levels:</p>
          <ul style="margin-left: 2em;">
            <li><b>Level 1:</b> A heatmap that visualizes maximum or minimum monthly temperatures across years and months.</li>
            <li><b>Level 2:</b> An enhanced heatmap that overlays mini line charts within each cell to visualize daily temperature changes for each month.</li>
          </ul>
          <p>Both visualizations are implemented using D3.js in an Observable Notebook environment, allowing for interactivity and dynamic updates.</p>`
      },
      {
        title: "Methodology",
        content: `<ol style="margin-left: 2em;">
          <li>Data Aggregation:
            <ul style="margin-left: 2em;">
              <li>Monthly maximum and minimum temperatures are aggregated for Level 1</li>
              <li>Daily temperature records are processed for Level 2</li>
            </ul>
          </li>
          <li>Visualization Design:
            <ul style="margin-left: 2em;">
              <li>Level 1 uses a heatmap layout with color-coded cells representing temperatures</li>
              <li>Level 2 builds upon Level 1 by adding mini line charts within each cell to show daily fluctuations</li>
            </ul>
          </li>
          <li>Interactivity:
            <ul style="margin-left: 2em;">
              <li>Radio buttons allow users to toggle between maximum and minimum temperature views</li>
              <li>Tooltips display detailed information when hovering over cells</li>
            </ul>
          </li>
        </ol>`
      },
      {
        title: "Result",
        content: `<p>The project successfully delivers two interactive visualizations:</p>
          <ul style="margin-left: 2em;">
            <li>Level 1 Heatmap: toggle between max/min temperature views with detailed tooltips</li>
            <li>Level 2 Enhanced Heatmap: mini line charts overlay each cell, showing daily maximum and minimum temperature variations with global scaling for consistent representation</li>
          </ul>
          <p>These visualizations offer a dynamic way to explore Hong Kong's historical temperature data, making the information accessible and engaging for climate researchers, educators, and enthusiasts.</p>`
      }
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/tanaymehendale/CSCE-679", icon: "fa-external-link" },
      { label: "Level 1 Visualization", url: "https://observablehq.com/d/ed4cf2f624cad356", icon: "fa-external-link" },
      { label: "Level 2 Visualization", url: "https://observablehq.com/d/ec193d17ea9be76a", icon: "fa-external-link" }
    ]
  },
  {
    slug: "market-basket",
    title: "Market Basket Analysis in R",
    shortDesc: "Apriori algorithm on 15,000 grocery transactions in R — association rules driving store layout and promotion recommendations.",
    tags: ["R", "Apriori", "arules", "Business Analytics"],
    featured: false,
    impact: "Through analysis of approximately 15,000 grocery transactions using R and the Apriori algorithm, this project uncovered key product associations and purchasing patterns, leading to actionable recommendations that could optimize product placement and potentially increase sales through strategic merchandising.",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>A retail grocery store needed to understand customer purchasing patterns and product associations to optimize their store layout and boost sales. The analysis required processing transaction data to identify frequently purchased items and discover meaningful relationships between products that could inform merchandising decisions.</p>`
      },
      {
        title: "Approach",
        content: `<p>The analysis utilized the following strategy:</p>
          <ul style="margin-left: 2em;">
            <li>Process and clean transaction data from groceries.csv</li>
            <li>Convert raw data into a transaction format suitable for association analysis</li>
            <li>Identify top-selling products and their contribution to overall sales</li>
            <li>Generate association rules using the Apriori algorithm</li>
            <li>Visualize product relationships through interactive graphs</li>
          </ul>`
      },
      {
        title: "Methodology",
        content: `<p>The implementation involved several key steps using R:</p>
          <ol style="margin-left: 2em;">
            <li>Transformed raw CSV data into a transaction database using the arules package</li>
            <li>Applied the Apriori algorithm with carefully tuned parameters (support = 0.001, confidence = 0.80)</li>
            <li>Created frequency plots to visualize top 20 selling items</li>
            <li>Generated association rules to understand product relationships</li>
            <li>Visualized rules using arulesViz package to create an interactive network graph</li>
          </ol>`
      },
      {
        title: "Result",
        content: `<p>The analysis revealed several significant findings:</p>
          <ul style="margin-left: 2em;">
            <li>The top 20 items accounted for approximately 50.37% of total sales</li>
            <li>Strong associations were discovered between certain product categories, particularly beverages and fresh produce</li>
            <li>Based on the findings, three key recommendations were developed:
              <ol style="margin-left: 2em;">
                <li>Implement promotional offers on alcoholic beverages</li>
                <li>Create dedicated aisles combining vegetables, fruits, herbs, rice, juices, and meat</li>
                <li>Position vegetables and whole milk centrally, surrounded by complementary products</li>
              </ol>
            </li>
          </ul>`
      }
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/tanaymehendale/market-basket-analysis", icon: "fa-external-link" }
    ]
  },
  {
    slug: "pos-system",
    title: "AWS Point-of-Sale (POS) System",
    shortDesc: "MariaDB + MongoDB POS system on AWS EC2 — normalized schema, stored procedures, replication, and NoSQL migration.",
    tags: ["AWS EC2", "MariaDB", "MongoDB", "Database Design"],
    featured: false,
    isAcademicRestricted: true,
    impact: "Through comprehensive development of a Point-of-Sale (POS) system using MariaDB and MongoDB, this project demonstrated end-to-end database management capabilities from infrastructure setup to data migration, enabling efficient transaction processing and scalable data management.",
    sections: [
      {
        title: "Problem Statement",
        content: `<p>A retail business needed a robust Point-of-Sale system that could handle customer transactions, inventory management, and business analytics. The system needed to be scalable, maintain data integrity, and eventually support fast read operations for growing business needs.</p>`
      },
      {
        title: "Approach",
        content: `<p>The development strategy focused on a phased implementation:</p>
          <ul style="margin-left: 2em;">
            <li>Set up AWS EC2 infrastructure for hosting the database</li>
            <li>Design and implement relational schema in MariaDB</li>
            <li>Create business logic using stored procedures and triggers</li>
            <li>Implement data replication for scalability</li>
            <li>Migrate to MongoDB for improved read performance</li>
          </ul>`
      },
      {
        title: "Methodology",
        content: `<h3>Infrastructure Setup</h3>
          <p>The implementation began with configuring an AWS EC2 instance and installing MariaDB. Shell scripts were used to automate the installation process and configure necessary dependencies.</p>
          <h3>Database Development</h3>
          <p>The system was built progressively:</p>
          <ul style="margin-left: 2em;">
            <li>Created normalized database schema</li>
            <li>Implemented data validation using triggers</li>
            <li>Developed stored procedures for business logic</li>
            <li>Set up primary-secondary replication for scalability</li>
            <li>Configured peer-to-peer replication across multiple nodes</li>
          </ul>
          <h3>NoSQL Migration</h3>
          <p>The final phase involved migrating data to MongoDB:</p>
          <ul style="margin-left: 2em;">
            <li>Transformed relational data into JSON format</li>
            <li>Designed document structures for MongoDB</li>
            <li>Implemented MongoDB queries for business analytics</li>
          </ul>`
      },
      {
        title: "Result",
        content: `<p>The project delivered a fully functional POS system with:</p>
          <ul style="margin-left: 2em;">
            <li>Robust data integrity through triggers and stored procedures</li>
            <li>Improved read performance through replication</li>
            <li>Scalable architecture supporting multiple nodes</li>
            <li>Flexible NoSQL implementation for fast queries</li>
          </ul>
          <p>The system successfully demonstrated the practical application of both relational and NoSQL databases in a real-world business context, showcasing the benefits of polyglot persistence in modern database architecture.</p>`
      }
    ],
    links: [
      { label: "Request Project Files", url: "https://linkedin.com/in/tanay-mehendale", icon: "fa-external-link" }
    ]
  },
  {
    slug: "quote-to-cash",
    title: "Quote-to-Cash Analysis — Tableau Next & Salesforce",
    shortDesc: "Revenue flow analytics dashboard built during the Salesforce Tableau Next Hackathon — Q2C pipeline reimagined.",
    tags: ["Tableau Next", "Salesforce", "Business Analytics"],
    featured: false,
    isComingSoon: true,
    comingSoonMessage: "During the Salesforce Tableau Next Hackathon, my teammates and I built a Quote-to-Cash analytics dashboard that reimagines how businesses track revenue flow. Explore the full details on my Substack:",
    comingSoonIcon: "fa-book",
    comingSoonCallout: "Read this on my Substack!",
    substackEmbed: true,
    substackTitle: "AI-powered Analysis with Tableau Next by Tanay Mehendale",
    substackDesc: "This post highlights my experience using Salesforce's new offering \"Tableau Next\" through the Tableau Next Hackathon.",
    substackUrl: "https://tanaymehendale.substack.com/p/ai-powered-analysis-with-tableau",
    links: []
  }
];
